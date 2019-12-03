import React from "react";
import {View, Text, StyleSheet, ScrollView, TextInput, Picker, TouchableOpacity, RefreshControl} from "react-native";
import * as firebase from "firebase";
import 'firebase/firestore';
import {Card, Icon} from 'react-native-elements';

export default class CommentListScreen extends React.Component {
    state = {
        uid: "",
        email: "",
        displayName: "",
        comments: [],
    };

    db = firebase.firestore();

    componentDidMount() {
        const { uid, email, displayName } = firebase.auth().currentUser;

        this.setState({uid, email, displayName });
        this.fetchData();

        this.getEvent(this.parameter.idEvent);
    }

    constructor(props){
        super(props);

        this.parameter = {
            idEvent: this.props.navigation.state.params.idEvent,
        };
    }

    fetchData = async () => {
        this.db.collection('comments').where("eventid", "==" , this.parameter.idEvent).get().then((querySnapshot) => {
            this.setState({
                comments: querySnapshot.docs.map(doc => {
                    return {id: doc.id, data: doc.data()}
                })
            });
        }, error => {
            console.log(error);
        });
    };

    getEvent = (id) => {
        let docRef = this.db.collection("eventos").doc(id);
        docRef.get().then((doc) => {
            if(doc.exists){
                this.setState({
                    id: doc.id,
                    name: doc.data().name,
                    description:  doc.data().description,
                    fecha: doc.data().fecha,
                    hora: doc.data().hora,
                    state: doc.data().state,
                    userid: doc.data().userid
                });
            }else{
                console.log("El documento no existe");
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    saveComment = () => {
        const {namecomment, descriptioncomment} = this.state;
        this.db.collection("comments").add({
            name: namecomment,
            description: descriptioncomment,
            eventid: this.parameter.idEvent,
            userid: this.state.uid
        }).then(() => {
            console.log('Agregado el comentario');
        }).catch(() => {
            console.log('error');
        });
    };

    onRefresh(){
        this.setState({refreshing: true});
        this.fetchData().then(() => {
            this.setState({refreshing:false})
        });
    }

    render() {
        const {comments} = this.state;
        const {namecomment, descriptioncomment} = this.state;
        const {name, description, fecha, hora} = this.state;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />
                }
            >
            <View style={styles.container}>
                <Text style={styles.greeting}>Event</Text>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Name</Text>
                        <Text>{name}</Text>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Description</Text>
                        <Text>{description}</Text>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Fecha</Text>
                        <Text>{fecha}</Text>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Hora</Text>
                        <Text>{hora}</Text>
                    </View>
                </View>

                <Text style={styles.greeting}>List of Comments.</Text>

                    {comments && comments !== undefined ? comments.map((comment, key) => (
                        <Card key={key}>
                            <Text style={styles.namecard}>
                                {comment.data.name}
                            </Text>
                            <Text style={styles.descriptioncard}>
                                {comment.data.description}
                            </Text>
                        </Card>
                    )): null}

                    <View style={styles.formcomment}>
                        <View>
                            <Text style={styles.inputTitle}>Name</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                onChangeText={namecomment => this.setState({ namecomment })}
                                value={namecomment}
                            ></TextInput>
                        </View>

                        <View style={{ marginTop: 32 }}>
                            <Text style={styles.inputTitle}>Description</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                onChangeText={descriptioncomment => this.setState({ descriptioncomment })}
                                value={descriptioncomment}
                            ></TextInput>
                        </View>

                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.saveComment}>
                        <Text style={{ color: "#FFF", fontWeight: "500" }}>Comment</Text>
                    </TouchableOpacity>
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    contentbtnevent:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    formcomment: {
        marginVertical: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#79B254",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 48
    }
});
