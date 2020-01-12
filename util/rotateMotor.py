import RPi.GPIO as GPIO
import time
import sys

# Initialise the pins
if(sys.argv[1].lower() in ['true', '1']):
    pins = [7, 11, 13, 15]
else:
    pins = [12, 16, 18, 22]

GPIO.setmode(GPIO.BOARD)

for pin in pins:
  GPIO.setup(pin, GPIO.OUT, initial=False)


# Initialise the matrix
pattern = []
pattern.append([1,0,0,0])
pattern.append([1,1,0,0])
pattern.append([0,1,0,0])
pattern.append([0,1,1,0])
pattern.append([0,0,1,0])
pattern.append([0,0,1,1])
pattern.append([0,0,0,1])
pattern.append([1,0,0,1])

step = 0
sleepDuration = 0.005
turnAmount = int((sys.argv[2]).encode('utf-8'))

# Rotate the step motor
for j in range(0, turnAmount):

  for i in range(0,len(pins)):
    GPIO.output(pins[i],pattern[step % 8][i])

  step += 1
  time.sleep(sleepDuration)

# Finish the process
print("1")
sys.stdout.flush()
GPIO.cleanup()
