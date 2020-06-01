import pickle
import cv2
import numpy as np
import matplotlib.pyplot as plt
from keras.models import load_model
from keras.models import model_from_json
import sys

def closest(lst, K): 
    return lst[min(range(len(lst)), key = lambda i: abs(lst[i]-K))]

def predict_text(img,p):    
    # resize image
    img = cv2.resize(img, (243*2,326*2), interpolation = cv2.INTER_AREA)
    # orig = img.copy()

    # Thresholding the image
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    (thresh, img_bin) = cv2.threshold(gray, 128, 255,cv2.THRESH_BINARY + cv2.THRESH_OTSU )

    # Invert the image
    img_bin = 255-img_bin
    
    # Defining a kernel length
    kernel_length = np.array(img).shape[1]//80

    # A verticle kernel of (1 X kernel_length), which will detect all the verticle lines from the image.
    verticle_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, kernel_length))
    # A horizontal kernel of (kernel_length X 1), which will help to detect all the horizontal line from the image.
    hori_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_length, 1))
    # A kernel of (3 X 3) ones.
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))

    # Morphological operation to detect vertical lines from an image
    img_temp1 = cv2.erode(img_bin, verticle_kernel, iterations=3)
    verticle_lines_img = cv2.dilate(img_temp1, verticle_kernel, iterations=3)

    # Morphological operation to detect horizontal lines from an image
    img_temp2 = cv2.erode(img_bin, hori_kernel, iterations=3)
    horizontal_lines_img = cv2.dilate(img_temp2, hori_kernel, iterations=3)
    
    # Weighting parameters, this will decide the quantity of an image to be added to make a new image.
    alpha = 0.5
    beta = 1.0 - alpha
    # This function helps to add two image with specific weight parameter to get a third image as summation of two image.
    img_final_bin = cv2.addWeighted(verticle_lines_img, alpha, horizontal_lines_img, beta, 0.0)
    img_final_bin = cv2.erode(~img_final_bin, kernel, iterations=2)

    (thresh, img_final_bin) = cv2.threshold(img_final_bin, 128,255, cv2.THRESH_BINARY )
    

    _,contours, hierarchy = cv2.findContours(img_final_bin, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    #print(contours)

    # json_file = open('model.json', 'r')
    # loaded_model_json = json_file.read()
    # json_file.close()
    loaded_model = model_from_json(p)


    loaded_model.load_weights("model.h5")
    model = loaded_model
    # print('Model successfully loaded')

    characters = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','A','B','C','D','E','F','G','H','I','J','K','1','M','N','O','P','9','P','S','T','U','V','W','X','Y','Z']
    cpy = img.copy()

    #PRE PROCESSING
    sorted_ctrs = sorted(contours, key=lambda ctr: cv2.boundingRect(ctr)[1])

    y_set = []

    for i, ctr in enumerate(sorted_ctrs):
        # Get bounding box
        x, y, w, h = cv2.boundingRect(ctr)

        if (w > 10 and h > 10) and abs(w-h) < 10 and (w < 25 and h < 25):
            y_set.append(y)
    y_set = set(y_set)
    y_set = sorted(y_set)
    #print(y_set)

    group = []
    fields = []

    for i in y_set:
      if len(group) == 0:
        group.append(i)
      elif (i - group[0]) <= 5:
        group.append(i)
      else:
        group_mean = sum(group)/len(group)
        fields.append(group_mean)
        group.clear()
        group.append(i)

    group_mean = sum(group)/len(group)
    fields.append(group_mean)
    # print("fields -> ",fields)

    sorted_ctrs = sorted(contours, key=lambda ctr: cv2.boundingRect(ctr)[0] + closest(fields,cv2.boundingRect(ctr)[1]) * img_final_bin.shape[1])

    idx = "0"
    details = []
    str1 = ""

    px,py,pw,ph = -1,-1,-1,-1

    for i, ctr in enumerate(sorted_ctrs):
        # Get bounding box
        x, y, w, h = cv2.boundingRect(ctr)

        if (w > 10 and h > 10) and abs(w-h) < 10 and (w < 25 and h < 25):
            # Getting ROI
            roi = img_final_bin[y:y+h, x:x+w]

            # show ROI orig
            idx = str(int(idx)+1)
            #cv2_imshow('segment no:'+str(i),roi)
            cv2.rectangle(cpy,(x-1,y-1),( x + w +1, y + h +1),(70,255,70),1)
            cv2.putText(cpy,idx,(x,y),cv2.FONT_HERSHEY_COMPLEX,0.25,(0,0,0),1)

            #######################CODE####################################
            # Getting ROI
            roi = img[y-1:y+h+1, x-1:x+w+1]
            roi = cv2.resize(roi, dsize=(28,28), interpolation=cv2.INTER_CUBIC)
            roi = cv2.cvtColor(roi,cv2.COLOR_BGR2GRAY)
            ###if roi has no contours to detect###
            gray_roi = roi
            _, binary = cv2.threshold(gray_roi, 127 ,255, cv2.THRESH_BINARY_INV)
            
            #et,thresh_roi = cv2.threshold(gray_roi,127,255,cv2.THRESH_BINARY_INV)
            kernel_roi = np.ones((5,5), np.uint8)
            img_dilation_roi = cv2.dilate(binary,kernel_roi,iterations=1)
            gsblur_roi=cv2.GaussianBlur(img_dilation_roi,(5,5),0)
            
            _, ctrs_roi, hierarchy = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            cv2.drawContours(roi, ctrs_roi, -1, (0, 255, 0), 1)
        
            if(len(ctrs_roi) == 0):
              str1 = str1 + " "
              px,py,ph,pw = x,y,h,w
              continue
            #######################################
            roi = np.array(roi)
            t = np.copy(roi)
            t = t / 255.0
            t = 1-t
            t = t.reshape(1,784)
            ## m.append(roi)
            pred = model.predict_classes(t)
            #print(pred)
            letter = characters[pred[0]]

            ##BUILD DETAILS
            if px!=-1 and py!=-1 and ((abs(px-x)) > 22 or (abs(py-y)) > 22):
              details.append(str1)
              str1 = ""

            str1 = str1 + letter
            px,py,ph,pw = x,y,h,w
            #print(letter)
        ################################################################
    details.append(str1)
    # plt.imshow(cpy)
    # plt.show()
    #POSTPROCESSING
    for i in range(0,len(details)):
      if i >= len(details):
        break
    #   print(details[i])
      while (details[i][-1] == ' '):
        if(len(details[i]) == 1):
          details.remove(details[i])
          break
        details[i] = details[i][0:-1]

    details = [str1.upper() for str1 in details]
    return details

path = "image/image.jpg"

img = cv2.imread(path,cv2.IMREAD_UNCHANGED)
text_predicted = predict_text(img,sys.argv[1])


if text_predicted==[]:
  text_predicted=[-1]

for i in text_predicted:
    print(i)
