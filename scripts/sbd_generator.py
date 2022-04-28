#!/usr/bin/env python3

'''
Script to generate all permutations of sentences,
for Sentence Building Drill lessons.

Output will be in the format of O: and E: (no F:).
'''

segment_a = {}
segment_a["오늘부터"]="Starting from today, I am going to"
segment_a["내일부터"]="Starting from tomorrow, I am going to"
segment_a["지금부터"]="From now on, I am going to"
segment_a["언제부터"]="Starting from when, am I going to"

segment_b = {}
segment_b["한국어를"]="Korean[l]"

segment_c = {}
segment_c["열심히"]="hard."
segment_c["더 열심히"]="harder."
segment_c["덜 열심히"]="less hard."

segment_d = {}
segment_d["공부할 거예요."]="study"
segment_d["연습할 거예요."]="practice"
segment_d["쓸 거예요."]="use"
segment_d["말할 거예요."]="speak"
segment_d["배울 거예요."]="learn"
segment_d["일할 거예요."]="work on"
segment_d["준비할 거예요."]="prepare"


all_segments = list((
  segment_a,
  segment_b,
  segment_c,
  segment_d,
))

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
  for entry_a in segment_a:
    for entry_b in segment_b:
      for entry_c in segment_c:
        for entry_d in segment_d:
          o_sentence = f"{entry_a} {entry_b} {entry_c} {entry_d}"
          e_sentence = f"{segment_a[entry_a]} {segment_d[entry_d]} {segment_b[entry_b]} {segment_c[entry_c]}"
          all_sentences[o_sentence] = e_sentence

  print_sentences(all_sentences)
        
if __name__ == "__main__":
  generate_permutations()
