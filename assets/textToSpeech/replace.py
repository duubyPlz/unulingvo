#!/usr/bin/env python3

import argparse

def open_file(file_path):
    '''
    :return: file contents
    '''
    pass

def replace(raw_content):
    '''
    Performs the hardcoded string find/replace mutations on `raw_content`
    :return mutated content
    '''
    pass

def overwrite(text, file_path):
    '''
    Writes `text` to `file_path`, will be overwriting & ignoring previous existing content.
    :rtype: void
    '''
    pass


if __name__ == "__main__":
    # take in param
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--file-path", type=str, required=True,
        help='The directory plus name of which file to perform the mutations')
    args = parser.parse_args()

    file_path = args.file_path

    print("FILE PATH")
    print("{}".format(file_path)) # XXX deleteprint

    current_file = open_file(file_path)
    replaced = replace(current_file)
    overwrite(replace, file_path)
