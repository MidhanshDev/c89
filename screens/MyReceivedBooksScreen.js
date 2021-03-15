import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/MyHeader";
import { ListItem } from "react-native-elements";

export default class MyReceievdBooksScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      receivedBooksList: [],
      userId: firebase.auth().currentUser.email,
    };
    this.requestRef = null;
  }
  getReceivedBooksList = () => {
    this.requestRef = db
      .collection("requested_books")
      .where("user_Id", "==", this.state.userId)
      .where("book_status", "==", "received")
      .onSnapshot((snapshot) => {
        var receivedBooksList = snapshot.docs.map((document) =>
          document.data()
        );
        this.setState({
          receivedBooksList: receivedBooksList,
        });
        // console.log(this.state.requestBooksList);
      });
  };
  componentDidMount() {
    this.getReceivedBooksList();
  }
  componentWillUnmount() {
    this.requestRef();
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.book_status}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        bottomDivider
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Received Books" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.receivedBooksList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Received Books</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.receivedBooksList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
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
    width: 100,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    backgroundColor: "#844794",
  },
});
