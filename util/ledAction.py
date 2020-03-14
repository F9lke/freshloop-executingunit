import RPi.GPIO as GPIO
import time
import sys

# Store arguments
isToBePoweredOn = sys.argv[1].lower() in ['true', '1']
pin = int(sys.argv[2])

# Init the GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)

# Execute the led action
if isToBePoweredOn:
    GPIO.output(pin, GPIO.HIGH)
else:
    GPIO.output(pin, GPIO.LOW)

# Finish the process
print("1")
