#!/usr/bin/env python3

import sys
import argparse
import re


# Functions
def open_file(file_path):
    '''
    Read file and store its contents in memory by returning it.
    :return: file contents
    '''
    try:
        with open(file_path, "r") as file_stream:
            return file_stream.read()
    except FileNotFoundError:
        # print('Cannot open file: "{}". Exiting...'.format(file_path), file=sys.stderr)
        print('Cannot open file: "{}". Exiting...'.format(file_path))
        exit(1)


def replace(content_to_mutate, is_simple=False):
    '''
    Performs the hardcoded string find/replace mutations on `content_to_mutate`.
    :return: mutated content
    '''

    replacements = [
        (r"F:.*\n", r""),
        (r"\*.*\n", r""),
        (r"#.*\n    ", r""),
        (r"#.*\n", r""),
        (r"== (.*) ==", r"\1."),
        (r"(    O:.*)\n(    E:.*)", r"\2\n\1"),
        (r"E:(.*)", r"E:\1\n    Answer in\n    One.\n    Two.\n    Three.\n    Four.\n    Five."),
        (r"O:(.*)\n", r"O:\1\n\n    Next Sentence."),
        (r">(.*)", r"Lesson\1."),
        (r"    Next Sentence.\s*\nLesson", r"Lesson"),
        (r"([^.])\n    Answer", r"\1.\n    Answer"),
        (r"@([a-z, ]+)", r"[\1]"),
        (r"[OE]: ", r""),
        (r"(.*\n\n.*Lesson One.)", r"NUMPLACEHOLDER \1"),
        (r"Next Sentence.\s*\Z", "End of NUMPLACEHOLDER - TITLEPLACEHOLDER"),
        # (r"Next Sentence.\s*\Z", "End of NUMPLACEHOLDER - {}".format(title)),
    ]

    # TODO continue here: get title working & get NUMPLACEHOLDER (arg or in file_path)
    # title = re.match(r"== (.*) ==") the first group
    # for old, _ in replacements:
    #     derp = re.findall(old, content_to_mutate)
    #     print(derp)

    if not is_simple:
        for old, new in replacements:
            content_to_mutate = re.sub(old, new, content_to_mutate)
        
        return content_to_mutate
    else:
        mutated = ""
        for line in content_to_mutate.split('\n'):
            if re.search(r"    O: ", line):
                line = re.sub(r"    O: ", r"", line)
                mutated += line + "\n"

        return mutated


# # TODO Optional flag that allows overwriting of files.
# def overwrite(text, input):
#     '''
#     Writes `text` to `input`, will be overwriting & ignoring previous existing content.
#     :rtype: void
#     '''
#     try:
#         with open(input, "w") as file_stream:
#             file_stream.write(text)
#     except FileNotFoundError:
#         print('\n🛑 Cannot open file: "{}". Exiting...'.format(input), file=sys.stderr)
#         exit(1)


def write(text, output):
    '''
    Writes `text` to `output`.
    :rtype: void
    '''
    try:
        with open(output, "x") as file_stream:
            file_stream.write(text)
    except (FileNotFoundError, FileExistsError) as e:
        print('\n🛑 Error: {}, exiting...'.format(e), file=sys.stderr)
        exit(1)


# Main
# * Usages:
#   * ./tts_maker.py -i flu201.txt -o 201.txt
#   * ./tts_maker.py -s -i flu306.txt -o 306_simple.txt
# * File locations:
#   * Input: `assets/txt/`
#   * Output: `assets/textToSpeech/flu/`
# * Note: For normal version, will need to manually open up the output file and fix the last line.
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input", type=str, required=True,
        help='The path of which file to convert')
    parser.add_argument("-o", "--output", type=str, required=True,
        help='The path of which new file to create')
    parser.add_argument("-s", "--simple", default=False, action="store_true",
        help='If this is on, it will be a target language-only version of a text-to-speech file')
    args = parser.parse_args()

    if args.simple:
        print('Simple version on.')

    input_path = "../assets/txt/" + args.input
    output_path = "../assets/textToSpeech/flu/" + args.output
    print('Reading from: {}'.format(input_path))
    print('Outputting to: {}'.format(output_path))

    raw_content = open_file(input_path)
    mutated_content = replace(raw_content, args.simple)
    write(mutated_content, output_path)

    print('\nFinished ✨')
