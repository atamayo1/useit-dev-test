import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import * as firebase from "firebase";

export default class RecoverScreen extends React.Component{
    state = {
        email: "",
        errorMessage: null
    };

    handleRecover = () => {
        const { email } = this.state;
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .catch(error => this.setState({ errorMessage: error.message }));
    };

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>{`Recover your password, send us your email,`}</Text>
                <Text style={{ textAlign:"center", color: "#414959", fontSize: 13 }}>{`We are going to send you an email after this.`}</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleRecover}>
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Send</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }}
                                  onPress={() => this.props.navigation.navigate("Login")}>
                    <Text style={{ color: "#414959", fontSize: 13 }}>
                        New to UseIt? <Text style={{ fontWeight: "500", color: "#79B254" }}>Login</Text>
                    </Text>
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
