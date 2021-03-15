import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import firebase from "firebase";
import db from "../config";
import { SwipeListView } from "react-native-swipe-list-view";
import { ListItem, Icon } from "react-native-elements";

export default class SwipableFlatlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications,
    };
  }
  onSwipeValueChange = (swipeData) => {
    var allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotifications];
      this.updateMarkAsRead(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({
        allNotifications: newData,
      });
    }
  };
  updateMarkAsRead = (notification) => {
    db.collection("all_notifications").doc(notification.doc_id).update({
      notification_status: "read",
    });
  };
  renderItem = (data) => (
    <Animated.View>
      <ListItem
        leftElement={<Icon name="book" type="font-awesome" color="#847289" />}
        title={data.item.book_name}
        titleStyle={{
          color: "black",
          fontWeight: "bold",
        }}
        subtitle={data.item.message}
        bottomDivider
      />
    </Animated.View>
  );
  renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightbtn, styles.backRightbtnright]}>
        <Text style={styles.backTextwhite}>Mark as read</Text>
      </View>
    </View>
  );
  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#992378",
    flex: 1,
  },
  backTextwhite: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  rowBack: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    paddingLeft: 15,
    backgroundColor: "#333",
  },
  backRightbtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 100,
    bottom: 0,
    top: 0,
  },
  backRightbtnright: {
    backgroundColor: "#667",
    right: 0,
  },
});
