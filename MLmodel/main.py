import os
import sys
length =len(sys.argv)
for i in range(1,length):
    os.system('python -m pip install {}'.format(sys.argv[i]))

    
print("hello from python")
