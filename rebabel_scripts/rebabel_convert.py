import json
import sys
import rebabel_format

(script_name, inType, outType, inPath, outPath,
 nlpFileType, partOfSpeechFile, languageFile, delimiter, mappings, root, skip) = sys.argv

if mappings:
    mappings = json.loads(mappings)

rebabel_format.load_processes(True)
rebabel_format.load_readers(True)
rebabel_format.load_writers(True)
rebabel_format.get_process_parameters("export")

if inType == "nlp_pos" and nlpFileType == "separate":
    inPathList = inPath.split(',')
    langPos = 0
    posPos = 1
    if languageFile in inPathList[1] and partOfSpeechFile in inPathList[0]:
        langPos = 1
        posPos = 0
    
    rebabel_format.run_command(
        "import",
        mode = inType,
        db = "temp.db",
        infiles = [inPathList[langPos]],
        nlpFileType = "language"
    )
    
    rebabel_format.run_command(
        "import",
        mode = inType,
        db = "temp.db",
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
        db = "temp.db",
        infiles = [inPath],
        nlpFileType = "combined",
        delimiter = delimiter,
    )

rebabel_format.run_command(
    "export",
    mode = outType,
    db = "temp.db",
    outfile = outPath,
    mappings = [
        {'in_type': 'sentence', 'out_type': 'phrase'},
        {'in_feature': 'nlp:form', 'out_feature': 'FlexText:en:txt'},
        {'in_feature': 'nlp:pos', 'out_feature': 'FlexText:en:pos'}
    ],
    root = "phrase",
    skip = ["morph"]
)