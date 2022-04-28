#!/usr/bin/env python3

'''
Script to generate all permutations of sentences,
for Sentence Building Drill lessons.

Output will be in the format of O: and E: (no F:).
'''


segment_a = {}
segment_a["내일"]="tomorrow,"
segment_a["오늘"]="today,"
segment_a["주말에"]="this weekend,"
segment_a["다음 주에"]="next week,"
segment_a["이번 달에"]="this month,"

segment_b = {}
segment_b["시간이 있으면"]="If you have time"
segment_b["시간이 없으면"]="If you don't have time"
segment_b["시간이 많이 있으면"]="If you have a lot[av] of time"
segment_b["시간이 많으면"]="If you have a lot[v] of time"
segment_b["시간이 조금 밖에 없으면"]="If you have only a little bit of time"
segment_b["시간이 전혀 없으면"]="If you have no time at all"

segment_c = {}
segment_c["같이"]="together?"
segment_c["저랑"]="with me?"
segment_c["저랑 같이"]="together with me?"
segment_c["다 같이"]="with everyone?"

segment_d = {}
segment_d["커피 마실래요?"]="do you want to drink coffee"
segment_d["뭐 마실래요?"]="what do you want to drink"
segment_d["어떤 거 마실래요?"]="what kind of drink do you want"
segment_d["어디에서 마실래요?"]="where do you want to drink (something)"


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
        for key_d in segment_d:
          value_a = segment_a[key_a]
          value_b = segment_b[key_b]
          value_c = segment_c[key_c]
          value_d = segment_d[key_d]
          o_sentence = f"{key_a} {key_b} {key_c} {key_d}"
          e_sentence = f"{value_b} {value_a} {value_d} {value_c}"
          all_sentences[o_sentence] = e_sentence

  print_sentences(all_sentences)
        
if __name__ == "__main__":
  generate_permutations()
