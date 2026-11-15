# Erzeugt tests/fixtures/fsrs_reference.json mit der offiziellen Referenz py-fsrs (pip install fsrs==6.3.3).
# Tagwerk rechnet ohne Lernschritte und ohne Zufallsstreuung nach, damit der Vergleich exakt ist.
import json, random, pathlib
from datetime import datetime, timezone, timedelta
from fsrs import Scheduler, Card, Rating
sch = Scheduler(learning_steps=(), relearning_steps=(), enable_fuzzing=False, maximum_interval=3650)  # wie Tagwerk: höchstens 10 Jahre
random.seed(7)
cases = []
for c in range(40):
    card = Card()
    t = datetime(2026, 1, 1, 12, tzinfo=timezone.utc)
    seq = []
    for k in range(10):
        g = random.choice([1,3,3,3,2,3,1,3,4][:8])
        card, _ = sch.review_card(card, Rating(g), review_datetime=t)
        ivl = (card.due - t).days
        seq.append({'g':g, 'day':(t - datetime(2026,1,1,12,tzinfo=timezone.utc)).days, 's':card.stability, 'd':card.difficulty, 'ivl':ivl})
        # review on due date, sometimes late
        late = random.choice([0,0,0,2,7])
        t = card.due + timedelta(days=late)
    cases.append(seq)
out = pathlib.Path(__file__).resolve().parent.parent / 'tests' / 'fixtures' / 'fsrs_reference.json'
json.dump(cases, open(out, 'w'))
print('geschrieben:', out, len(cases), 'Karten')
print('ref cases', len(cases))
