#!/usr/bin/env python3

'''
Script to generate all permutations of sentences,
for Sentence Building Drill lessons.

Output will be in the format of O: and E: (no F:).
'''


segment_a = {}
segment_a["아마"]="It will probably"
segment_a["분명히"]="It will certainly"
segment_a["어쩌면"]="It might" # manual o -지도 몰라요.
segment_a["어쩌면2"]="It could" # manual o -ㄹ 수도 있어요.

segment_b = {}
segment_b["내일부터 일요일까지"]="from tomorrow until Sunday."
segment_b["내일부터 모레까지"]="from tomorrow until the day after tomorrow."
segment_b["어제부터 오늘까지"]="from yesterday until today."
segment_b["지난주부터 다음 주까지"]="from last week until next week."

segment_c = {}
segment_c["비가 내릴 거예요."]="rain[l]"
segment_c["비가 올 거예요."]="rain"
segment_c["눈이 내릴 거예요."]="snow[l]"
segment_c["눈이 올 거예요."]="snow"
segment_c["비가 그칠 거예요."]="stop raining"
segment_c["눈이 그칠 거예요."]="stop snowing"
segment_c["비가 많이 내릴 거예요."]="rain[l] a lot"
segment_c["눈이 내릴 거예요."]="snow[l] a lot"


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
        o_sentence = f"{entry_a} {entry_b} {entry_c}"
        e_sentence = f"{segment_a[entry_a]} {segment_c[entry_c]} {segment_b[entry_b]}"
        all_sentences[o_sentence] = e_sentence

  print_sentences(all_sentences)
        
if __name__ == "__main__":
  generate_permutations()
