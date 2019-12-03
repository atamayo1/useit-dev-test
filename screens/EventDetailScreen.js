import React from "react";
import {View, Text, StyleSheet, ScrollView, TextInput, Picker, TouchableOpacity} from "react-native";
import * as firebase from "firebase";
import 'firebase/firestore';
import DatePicker from "react-native-datepicker";

export default class EventDetailScreen extends React.Component {
    state = {
        uid: "",
        email: "",
        displayName: ""
    };

    db = firebase.firestore();

    componentDidMount() {
        const { uid, email, displayName } = firebase.auth().currentUser;

        this.setState({uid, email, displayName });
        this.getEvent(this.parameter.idEvent);
    }

    constructor(props){
        super(props);

        this.parameter = {
          idEvent: this.props.navigation.state.params.idEvent,
        };
    }

    updateEvent = () => {
        const {id, name, description, fecha, hora, state} = this.state;

        this.db.collection("eventos").doc(id).update({
            name: name,
            description: description,
            fecha: fecha,
            hora: hora,
            state: state,
        }).then(() => {
            console.log('actualizado');
            this.props.navigation.navigate('Home');
        }).catch((error) => {
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

    render() {
        const {name, description, fecha, hora, state} = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>Detail of Event.</Text>
                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Name</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={name => this.setState({ name })}
                            value={name}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Description</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={description => this.setState({ description })}
                            value={description}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Date</Text>
                        <DatePicker
                            style={{width: 350}}
                            date={fecha}
                            mode="date"
                            placeholder="select date"
                            format="DD/MM/YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={fecha => this.setState({ fecha })}
                        />
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Hour</Text>
                        <DatePicker
                            style={{width: 350}}
                            date={hora}
                            mode="time"
                            placeholder="select hour"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={hora => this.setState({ hora })}
                        />
                    </View>
                    <Picker
                        selectedValue={state}
                        style={{height: 50, width: 350}}
                        onValueChange={state => this.setState({ state })}>
                        <Picker.Item label="Select the state of event" value="" />
                        <Picker.Item label="Public" value="true" />
                        <Picker.Item label="Private" value="false" />
                    </Picker>

                </View>
                <TouchableOpacity style={styles.button} onPress={this.updateEvent}>
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Save</Text>
                </TouchableOpacity>
            </View>
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
    form: {
        marginBottom: 48,
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
        justifyContent: "center"
    }
});
