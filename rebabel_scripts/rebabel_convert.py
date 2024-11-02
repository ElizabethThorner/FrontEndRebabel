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

if inType == "nlp_pos":
    if additionalArguments["nlpFileType"] == "separate":
        inPathList = inPath.split(',')
        langPos = 0
        posPos = 1
        if additionalArguments["languageFile"] in inPathList[1] and additionalArguments["partOfSpeechFile"] in inPathList[0]:
            langPos = 1
            posPos = 0
        
        rebabel_format.run_command(
            "import",
            mode = inType,
            db = tempdb_path,
            infiles = [inPathList[langPos]],
            nlpFileType = "language"
        )
        
        rebabel_format.run_command(
            "import",
            mode = inType,
            db = tempdb_path,
            infiles = [inPathList[posPos]],
            nlpFileType = "pos",
            merge_on = {
                'sentence': 'meta:index',
                'word': 'meta:index'
            }
        )
    else:
        rebabel_format.run_command(
            "import",
            mode = inType,
            db = tempdb_path,
            infiles = [inPath],
            nlpFileType = "combined",
            delimiter = additionalArguments["nlpDelimiter"]
        )
else:
    rebabel_format.run_command(
            "import",
            mode = inType,
            db = tempdb_path,
            infiles = [inPath]
        )

if (outType == "flextext"):
    if (additionalArguments["skip"] == []):
        rebabel_format.run_command(
            "export",
            mode = outType,
            db = tempdb_path,
            outfile = outPath,
            mappings = mappings[0] + mappings[1],
            root = additionalArguments["root"]
        )
    else:
        rebabel_format.run_command(
            "export",
            mode = outType,
            db = tempdb_path,
            outfile = outPath,
            mappings = mappings[0] + mappings[1],
            root = additionalArguments["root"],
            skip = additionalArguments["skip"]
        )
else:
    rebabel_format.run_command(
            "export",
            mode = outType,
            db = tempdb_path,
            outfile = outPath,
            mappings = mappings[0] + mappings[1]
        )
    
