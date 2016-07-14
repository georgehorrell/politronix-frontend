# Data spoofer
# George Horrell

import random

def generate_next(prev, absMax, delta):
    newVal = prev + (delta * random.choice([-1, 0, 1]))
    if (abs(newVal) > absMax):
        return prev
    else:
        return newVal

hillary_pt = 0
trump_pt = 0
delta = 1
absMax = 10

hillaryData = []
trumpData = []

for i in range(28):
    hillary_pt = generate_next(hillary_pt, absMax, delta)
    hillaryData.append(hillary_pt)

    trump_pt = generate_next(trump_pt, absMax, delta)
    trumpData.append(trump_pt)

f = open('spoof-data.csv', 'w')

f.write('datapt,hillary,trump\n')
for i in range(28):
    f.write(str(i) + ',' + str(hillaryData[i]) + ',' + str(trumpData[i]) + '\n')

f.close()
