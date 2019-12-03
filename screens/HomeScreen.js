import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Picker} from "react-native";
import * as firebase from "firebase";
import 'firebase/firestore';
import { Card, Icon } from 'react-native-elements';

export default class HomeScreen extends React.Component {
  state = {
      uid: "",
    email: "",
    displayName: "",
      events: []
  };

  db = firebase.firestore();

    componentDidMount() {
    const { uid, email, displayName } = firebase.auth().currentUser;

    this.setState({uid, email, displayName });
    this.fetchDate();
  }

    fetchDate = async () => {
        this.db.collection('eventos').orderBy('fecha','desc').get().then((querySnapshot) => {
            this.setState({
                events: querySnapshot.docs.map(doc => {
                    return {id: doc.id, data: doc.data()}
                })
            });
        }, error => {
            console.log(error);
        });
    };

  signOutUser = () => {
    firebase.auth().signOut();
  };

    deleteEvent = (id) => {
     this.db.collection('eventos').doc(id).delete();
    };

    goToCreateEvent = () => {
        this.props.navigation.navigate('EventCreate');
    };

    showOptions = (event, state) => {
        const optionDeleteEvent =
            <Icon
                raised
                name='trash'
                type='font-awesome'
                color='#ff0000'
                onPress={() => this.deleteEvent(event.id)}/>;
        const optionEventDetail =
            <Icon
                raised
                name='pencil'
                type='font-awesome'
                color='#79b254'
                onPress={() => this.props.navigation.navigate('EventDetail', {idEvent: event.id})}/>;

        const options = [optionEventDetail, optionDeleteEvent];

        if(event.data.userid == state.uid){
            return options;
        }
    };

    onRefresh(){
        this.setState({refreshing: true});
        this.fetchDate().then(() => {
            this.setState({refreshing:false})
        });
    }

  render() {
      const {events} = this.state;
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />
            }
        >
        <View style={styles.container}>
            <View style={styles.contentmenu}>
                <Icon
                    raised
                    name='sign-out'
                    type='font-awesome'
                    color='#79b254'
                    onPress={this.signOutUser}
                />
                <Icon
                    raised
                    name='plus-circle'
                    type='font-awesome'
                    color='#79b254'
                    onPress={this.goToCreateEvent}
                />
            </View>

            <Text style={styles.greeting}>Hi {this.state.email} ,</Text>

            <Text style={styles.greeting}>List of Events</Text>


                {events && events !== undefined ? events.map((event, key) => (
                    <Card key={key}>
                        <Text style={styles.namecard}>
                            {event.data.name}
                        </Text>
                        <Text style={styles.descriptioncard}>
                            {event.data.description}
                        </Text>
                        <Text style={styles.datecard}>
                            {event.data.fecha}, {event.data.hora}
                        </Text>
                        <View style={styles.contentbtnevent}>
                            <Icon
                                raised
                                name='comments'
                                type='font-awesome'
                                color='#79b254'
                                onPress={() => this.props.navigation.navigate('CommentList', {idEvent: event.id})}/>

                            {this.showOptions(event, this.state)}
                        </View>
                    </Card>
                )): null}
        </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    contentmenu: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    namecard:{
        fontSize: 18,
        fontWeight: "600"
    },
    descriptioncard:{
        fontSize: 18,
        fontWeight: "400"
    },
    datecard:{
        fontSize: 18,
        fontWeight: "600"
    },
    contentbtnevent:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#79B254",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    }
});
