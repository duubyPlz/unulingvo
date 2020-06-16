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


def replace(content_to_mutate):
    '''
    Performs the hardcoded string find/replace mutations on `content_to_mutate`.
    :return mutated content
    '''

    # TODO continue here: fix regex syntax to be pythonic
    replacements = [
        (r"F:.*$\n", ""),
        (r"\*.*$\n", ""),
        (r"#.*$\n    ", ""),
        (r"#.*$\n", ""),
        (r"== (.*) ==", "\1."),
        (r"(    O:.*)\n(    E:.*)", "\2\n\1"),
        # (r"E:(.*)", "E:\1\n    Answer in\n    One.\n    Two.\n    Three.\n    Four.\n    Five."),
        # (r"O:(.*)\n", "O:\1\n\n    Next Sentence."),
        # (r">(.*)", "Lesson\1."),
        # (r"    Next Sentence.\s*\nLesson", "Lesson"),
        # (r"([^.])\n    Answer", "\1.\n    Answer"),
        # (r"@([a-z, ]+)", "[\1]"),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
        # (r"", ""),
    ]

    for old, new in replacements:
        content_to_mutate = re.sub(old, new, content_to_mutate)

    print("FINAL")
    print(content_to_mutate)

    return content_to_mutate


def overwrite(text, file_path):
    '''
    Writes `text` to `file_path`, will be overwriting & ignoring previous existing content.
    :rtype: void
    '''
    try:
        with open(file_path, "w") as file_stream:
            file_stream.write(text)
    except FileNotFoundError:
        # print('Cannot open file: "{}". Exiting...'.format(file_path), file=sys.stderr)
        print('Cannot open file: "{}". Exiting...'.format(file_path))
        exit(1)


# Main
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file-path", type=str, required=True,
        help='The directory plus name of which file to perform the mutations')
    args = parser.parse_args()

    raw_content = open_file(args.file_path)
    mutated_content = replace(raw_content)
    overwrite(mutated_content, args.file_path)
