import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  TouchableHighlight,
  FlatList,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import { BookSearch } from "react-native-google-books";
import { TouchableHighlightBase } from "react-native";
export default class BookRequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonToRequest: "",
      requestId: "",
      requestedBookName: "",
      bookStatus: "",
      docId: "",
      userDocId: "",
      isBookRequestActive: false,
      dataSource: "",
      showFlatList: false,
      imageLink: "",
    };
  }
  getBooksFromApi = async (bookName) => {
    this.setState({
      bookName: bookName,
    });
    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        "AIzaSyD6DNZLmNK3HOSq1LZYXHAROHe65IMpk5I"
      );
      this.setState({
        dataSource: books.data,
        showFlatList: true,
      });
    }
  };
  renderItem = ({ item, i }) => {
    return (
      <TouchableHighlight
        style={{
          alignItems: "center",
          backgroundColor: "#464",
          padding: 10,
          width: "90%",
        }}
        activeOpacity={0.6}
        underlayColor="#ff3287"
        onPress={() => {
          this.setState({
            showFlatList: false,
            bookName: item.volumeInfo.title,
          });
        }}
      >
        <Text>{item.volumeInfo.title}</Text>
      </TouchableHighlight>
    );
  };
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyD6DNZLmNK3HOSq1LZYXHAROHe65IMpk5I"
    );
    db.collection("requested_books").add({
      user_Id: userId,
      book_name: bookName,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      book_status: "Requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      image_link: books.data[0].volumeInfo.imageLinks.smallThumbnail,
    });
    await this.getBookRequest();
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActive: true,
          });
        });
      });
    this.setState({
      bookName: "",
      reasonToRequest: "",
      requestId: randomRequestId,
    });
    return Alert.alert("Book requested succesfully");
  };
  getBookRequest = () => {
    var bookRequest = db
      .collection("requested_books")
      .where("user_Id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedBookName: doc.data().book_name,
              bookStatus: doc.data().book_status,
              docId: doc.id,
            });
          }
        });
      });
  };
  getIsBookRequestActive = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((qry) => {
        qry.forEach((doc) => {
          this.setState({
            isBookRequestActive: doc.data().isBookRequestActive,
            userDocId: doc.id,
          });
        });
      });
  };
  updateBookRequestStatus = () => {
    db.collection("requested_books").doc(this.state.docId).update({
      book_status: "received",
    });
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActive: false,
          });
        });
      });
  };
  sendNotification = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var bookName = doc.data().book_name;
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the book " + bookName,
                  notification_status: "unread",
                  book_name: bookName,
                });
              });
            });
        });
      });
  };
  receivedBooks = (bookName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_books").add({
      user_id: userId,
      book_name: bookName,
      request_id: requestId,
      book_status: "received",
    });
  };
  componentDidMount() {
    this.getBookRequest();
    this.getIsBookRequestActive();
  }
  render() {
    if (this.state.isBookRequestActive === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "cyan",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Book name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View
            style={{
              borderColor: "cyan",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Book status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderColor: "violet",
              borderWidth: 1,
              backgroundColor: "#834849",
              width: 360,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName);
            }}
          >
            <Text>I received the book</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyboardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder="Enter Book Name"
              onChangeText={(text) => {
                this.getBooksFromApi(text);
              }}
              onClear={(text) => {
                this.getBooksFromApi("");
              }}
              value={this.state.bookName}
            />
            {this.state.showFlatList ? (
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                enableEmptySections={true}
                style={{ marginTop: 10 }}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <TextInput
                  style={[styles.formTextInput, { height: 300 }]}
                  placeholder="Why do You Need The Book"
                  onChangeText={(text) => {
                    this.setState({
                      reasonToRequest: text,
                    });
                  }}
                  value={this.state.reasonToRequest}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.addRequest(
                      this.state.bookName,
                      this.state.reasonToRequest
                    );
                  }}
                >
                  <Text>Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
          <Text>Book Request</Text>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  keyboardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#b46",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    backgroundColor: "#844794",
  },
});
