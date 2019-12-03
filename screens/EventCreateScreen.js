import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Picker } from "react-native";
import * as firebase from "firebase";
import 'firebase/firestore';

export default class EventCreateScreen extends React.Component {
    state = {
        uid: "",
        email: "",
        displayName: "",
        name: "",
        description: "",
        fecha: "",
        hora: "",
        state: "",
        userid: ""
    };
    db = firebase.firestore();

    componentDidMount() {
        const { uid, email, displayName } = firebase.auth().currentUser;
        this.setState({uid, email, displayName });
    }

    saveEvent = () => {
      const {name, description, fecha, hora, state} = this.state;
      this.db.collection("eventos").add({
          name: name,
          description: description,
          fecha: fecha,
          hora: hora,
          state: state,
          userid: this.state.uid
      }).then(() => {
          console.log('Agregado el evento');
          this.props.navigation.navigate('Home');
      }).catch(() => {
          console.log('error');
      });
    };

    render() {
        const {name, description, fecha, hora, state} = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>{`Create a Event.`}</Text>

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
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={fecha => this.setState({ fecha })}
                            value={fecha}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Hour</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={hora => this.setState({ hora })}
                            value={hora}
                        ></TextInput>
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
                <TouchableOpacity style={styles.button} onPress={this.saveEvent}>
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
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    error: {
        color: "#79B254",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
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
