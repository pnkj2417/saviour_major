import numpy as np 
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Input,Convolution2D,MaxPooling2D,Flatten,Dense,Dropout
from keras.utils import np_utils


# (x_, y_), (x_test, y_test) = tf.keras.datasets.fashion_mnist.load_data()
# #print("x_train shape:", x_train.shape, "y_train shape:", y_train.shape)
# X_train,Y_train=x_test,y_test
# X_train=X_train.reshape((-1,28,28,1))
# Y_train=np_utils.to_categorical(Y_train)
# print(X_train.shape,Y_train.shape)

# x_=x_.reshape((-1,28,28,1))

#cnn model 
model=Sequential()
model.add(Convolution2D(32,(3,3),activation="relu",input_shape=(28,28,1)))
# model.add(Convolution2D(64,(3,3),activation="relu"))
# model.add(Dropout(0.25))
# model.add(MaxPooling2D(2,2))

# model.add(Convolution2D(32,(3,3),activation="relu"))
# model.add(Convolution2D(16,(3,3),activation="relu"))

# model.add(Flatten())
model.add(Dense(10,activation="softmax"))#to predict output
print(type(model))

#model.compile(loss="categorical_crossentropy",optimizer="adam",metrics=["accuracy"])
#hist=model.fit(X_train,Y_train,epochs=1,shuffle=True,batch_size=256,validation_split=0.40)
# model_json=model.to_json

# with open("model.json", "w") as json_file:
#     json_file.write(str(model_json))

# model.save_weights("model.h5")
# print("Saved model to disk")

# print(y_[1:30])
# print(model.predict_classes(x_[1:30,:]))


