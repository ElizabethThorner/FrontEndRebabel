import json
import sys
import rebabel_format

(script_name, inType, outType, inPath, outPath, mappings, additionalArguments, tempdb_path) = sys.argv

if mappings:
    mappings = json.loads(mappings)
if additionalArguments:
    additionalArguments = json.loads(additionalArguments)

rebabel_format.load_processes(True)
rebabel_format.load_readers(True)
rebabel_format.load_writers(True)
rebabel_format.get_process_parameters("export")

# base import arguments
importArgs = {
    "mode": inType,
    "db": tempdb_path,
    "infiles": [inPath]
}

# additional import arguments
if inType == "nlp_pos":
    if additionalArguments["nlpFileType"] == "separate":
        inPathList = inPath.split(',')
        if additionalArguments["languageFile"] in inPathList[0] and additionalArguments["partOfSpeechFile"] in inPathList[1]:
            langPos, posPos = 0, 1
        else:
            langPos, posPos = 1, 0
        
        # set the arguments for importing the language data file and issue run command
        importArgs["infiles"] = [inPathList[langPos]]
        importArgs["nlpFileType"] = "language"
        rebabel_format.run_command("import", **importArgs)

        # change the arguments to import the part of speech file instead, for when the run command is used again later
        importArgs["infiles"] = [inPathList[posPos]]
        importArgs["nlpFileType"] = "pos"
        importArgs["merge_on"] = {
                'sentence': 'meta:index',
                'word': 'meta:index'
            }
        
    if additionalArguments["nlpFileType"] == "combined":
        importArgs["nlpFileType"] = "combined"
        importArgs["delimiter"] = additionalArguments["nlpDelimiter"]

rebabel_format.run_command("import", **importArgs)

# base export arguments
exportArgs = {
    "mode": outType,
    "db": tempdb_path,
    "outfile": outPath,
    "mappings": mappings[0] + mappings[1]
}

# additional export arguments
if (outType == "flextext"):
    exportArgs["root"] = additionalArguments["root"]
    if additionalArguments["skip"]:
        exportArgs["skip"] = additionalArguments["skip"]

if (outType == "elan"):
    exportArgs["template_file"] = additionalArguments["templateFile"]
    exportArgs["seconds"] = additionalArguments["seconds"]

rebabel_format.run_command("export", **exportArgs)
