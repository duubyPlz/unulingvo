#!/usr/bin/env python3

'''
Script to generate all permutations of sentences,
for Sentence Building Drill lessons.

Output will be in the format of O: and E: (no F:).
'''


segment_a = [
  "오늘부터",
  "내일부터",
  "지금부터",
  "언제부터",
]

segment_b = [
  "한국어를",
]

segment_c = [
  "열심히",
  "더 열심히",
  "덜 열심히",
]

segment_d = [
  "공부할 거예요.",
  "연습할 거예요.",
  "쓸 거예요.",
  "말할 거예요.",
  "배울 거예요.",
  "일할 거예요.",
  "준비할 거예요.",
  "연습할 거예요.",
]


def print_sentences(all_sentences):
  for sentence in all_sentences:
    print(f"    O: {sentence}")
    print("    E: ")
    print()

def generate_permutations():
  '''
  Generates all possible permutations of the given sentence phrases, based on multiple segment possibilities.
  '''
  all_sentences = []
  for entry_a in segment_a:
    for entry_b in segment_b:
      for entry_c in segment_c:
        for entry_d in segment_d:
          sentence = f"{entry_a} {entry_b} {entry_c} {entry_d}"
          all_sentences.append(sentence)
  print_sentences(all_sentences)
        
if __name__ == "__main__":
  generate_permutations()
