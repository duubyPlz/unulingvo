#!/usr/bin/env python3

'''
Script to generate all permutations of sentences,
for Sentence Building Drill lessons.

Output will be in the format of O: and E: (no F:).

Steps:
  1. Edit the sections marked by `VARIABLE`
  2. Call script with:
    ./sbd_generator.py | pbcopy
  3. Paste into the new assets/txt/_.txt file.
'''

# 지금 카페에서 어제 산 책을 읽고 있어요.
# = Right now I am in a cafe, reading a book that I bought yesterday.

# VARIABLE: Segment dictionaries
segment_a = {}
segment_a["지금"]="Right now"

segment_b = {}
segment_b["카페에서"]="in a cafe,"
segment_b["한국에서"]="in Korea,"
segment_b["여기에서"]="here,"

segment_c = {}
segment_c["어제 산 책을 읽고 있어요."]="I am reading the book{l} I bought yesterday."
segment_c["그제 산 책을 읽고 있어요."]="I am reading the book{l} I bought the day before yesterday."
segment_c["이번 주에 만난 친구을 대화하고 있어요."]="I am conversing with the friend{l} I met up with this week."
segment_c["작년에 찍은 사진를 보고 있어요."]="I am looking at the picture{l} I took last year."
segment_c["책을 읽고 있어요."]="I am reading a book{l}."
segment_c["음악을 듣고 있어요."]="I am listening to music{l}."
segment_c["운동을 하고 있어요."]="I am exercising{l}."
segment_c["뭐 하고 있어요?"]="what are you doing?"

class AutoDict(dict):
  def __missing__(self, key):
    value = self[key] = type(self)()
    return value

def print_sentences(all_sentences):
  for key in all_sentences:
    print(f"    O: {key}")
    print(f"    E: {all_sentences[key]}")
    print()

def generate_permutations():
  '''
  Generates all possible permutations of the given sentence phrases, based on multiple segment possibilities.
  '''
  all_sentences = AutoDict()
  for key_a in segment_a:
    for key_b in segment_b:
      for key_c in segment_c:
        # for key_d in segment_d:
          value_a = segment_a[key_a]
          value_b = segment_b[key_b]
          value_c = segment_c[key_c]
          # value_d = segment_d[key_d]
          o_sentence = f"{key_a} {key_b} {key_c}"
          # VARIABLE: The english sentence may need rearrangement of segments (may not be: a -> b -> c -> d)
          e_sentence = f"{value_a} {value_b} {value_c}"
          all_sentences[o_sentence] = e_sentence

  print_sentences(all_sentences)

if __name__ == "__main__":
  generate_permutations()
