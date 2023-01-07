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

# 오늘은 어제보다 훨씬 따뜻한 것 같아요.
# = I think today is much warmer than yesterday.

# VARIABLE: Segment dictionaries
segment_a = {}
segment_a["오늘은"]="today"

segment_b = {}
segment_b["어제보다"]="compared to yesterday."
segment_b["지난주보다"]="compared to last week."
segment_b["지난달보다"]="compared to last month."
segment_b["작년보다"]="compared to last year."
segment_b["이거보다"]="compared to this one."
segment_b["한국어보다"]="compared to Korean."

segment_c = {}
segment_c["훨씬 따뜻한 것 같아요."]="I think it is much warmer{s}"
segment_c["훨씬 좋은 것 같아요."]="I think it is much better{s}"
segment_c["훨씬 재미있는 것 같아요."]="I think it is much more interesting"
segment_c["훨씬 따뜻해요."]="It's much warmer{s}"
segment_c["훨씬 좋아요."]="It's much warmer{s}"
segment_c["훨씬 어려워요."]="It's much (more) difficult"

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
          e_sentence = f"{value_c} {value_a} {value_b}"
          all_sentences[o_sentence] = e_sentence

  print_sentences(all_sentences)

if __name__ == "__main__":
  generate_permutations()
