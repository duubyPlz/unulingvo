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

# VARIABLE: Segment dictionaries
segment_a = {}
segment_a["열 명"]="ten people{s},"
segment_a["한 명"]="one people{s},"
segment_a["두 명"]="two people{s},"
segment_a["세 명"]="three people{s},"

segment_b = {}
segment_b["초대했는데,"]="I have invited"
segment_b["말했는데,"]="I have told"
# segment_b["조심했는데,"]="I was careful"
# segment_b["열심히 공부했는데,"]="I studied hard"

segment_c = {}
segment_c["아무도 안 올 수도 있어요."]="but it's possible that no one will come."
segment_c["아무도 안 올 거예요."]="but no one will come."
segment_c["아무도 모를 거예요."]="but no one will know."
segment_c["아무도 안 할 거예요."]="but no one will do it."
segment_c["아무도 초대 안 할 거예요."]="but no one will be invited."
segment_c["안 올 수도 있어요."]="but (someone) might not come."
segment_c["안 줄 수도 있어요."]="but (someone) might not give it."
segment_c["안 그럴 수도 있어요."]="but it might not be so (the case)."
segment_c["안 웃길 수도 있어요."]="but it might not be funny."

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
          e_sentence = f"{value_b} {value_a} {value_c}"
          all_sentences[o_sentence] = e_sentence

  print_sentences(all_sentences)

if __name__ == "__main__":
  generate_permutations()
