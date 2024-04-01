import { StyleSheet, Text, Platform, TouchableOpacity, View, Image, PermissionsAndroid, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../components/features';
import { dummyMessages } from '../constants';
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';
import { apiCall } from '../api/openAI';

const HomeScreen = () => {

    // const [messages, setMessages] = useState(dummyMessages);
    const [messages, setMessages] = useState([]);
    const [recording, setRecording] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const ScrollViewRef = useRef();

    const clear = () => {
        setMessages([]);
        Tts.stop();
    }
    const stopSpeaking = () => {
        Tts.stop();
        setSpeaking(false);
    }

    const speechStartHandler = (e) => {
        console.log('Speech start handler', e);
    }

    const speechEndHandler = (e) => {
        setRecording(false);
        // console.log('Speech end handler', e);
    }

    const speechResultsHandler = (e) => {
        // console.log('voice event: ', e);
        const text = e.value[0];
        setResult(text);
    }

    const speechErrorHandler = (e) => {
        console.log('Speech error handler', e);
    }

    const startRecording = async () => {
        setRecording(true);
        Tts.stop();
        try {
            await Voice.start('en-US');
            // console.log('Recording started');
        } catch (error) {
            console.log('Error starting recording:', error);
        }
    }

    const stopRecording = async () => {
        try {
            await Voice.stop();
            setRecording(false);
            fetchResponse();
        } catch (error) {
            console.log('Error stopping recording:', error);
        }
    }

    const fetchResponse = () => {
        if (result.trim().length > 0) {
            let newMessages = [...messages]
            newMessages.push({ role: 'user', content: result.trim() })
            setMessages([...newMessages])
            updateScrollView();
            setLoading(true);
            apiCall(result.trim(), newMessages).then(res => {
                // console.log('got api data: ', res);
                setLoading(false);
                if (res.success) {
                    setMessages([...res.data]);
                    updateScrollView();
                    setResult('');
                    startTextToSpeech(res.data[res.data.length - 1]);
                } else {
                    Alert.alert('Error', res.msg)
                }
            })
        }
    }

    const startTextToSpeech = message => {
        if (!message.content.includes('https')) {
            setSpeaking(true);
            Tts.speak(message.content, {
                androidParams: {
                    KEY_PARAM_PAN: -1,
                    KEY_PARAM_VOLUME: 0.5,
                    KEY_PARAM_STREAM: 'STREAM_MUSIC',
                },
            });
        }
    }

    const updateScrollView = () => {
        setTimeout(() => {
            ScrollViewRef?.current?.scrollToEnd({ animated: true })
        }, 200);
    }

    useEffect(() => {
        // voice handler events
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;

        //tts handlers
        Tts.addEventListener('tts-start', (event) => console.log("start", event));
        Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
        Tts.addEventListener('tts-finish', (event) => { console.log("finish", event); setSpeaking(false) });
        Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

        const MicrophonePermission = async () => {
            if (Platform.OS === 'android') {
                const hasPermission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                )
                // console.log("hasPermission", hasPermission)
            }
        }

        MicrophonePermission()

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    console.log('result', result);

    return (
        <View style={styles.AndroidSafeArea} className="bg-gray-900">
            <View className="flex-1 flex mx-5">
                {/* bot icon */}
                <View className="flex-row justify-center">
                    <Image source={require('../../assets/images/Ai-Logo.png')} style={{ height: hp(12), width: hp(12) }} />
                </View>

                {/* features||messages */}
                {
                    messages.length > 0 ? (
                        <>
                            <View className="space-y-2 flex-1">
                                <Text style={{ fontSize: wp(5) }} className="text-gray-200 font-semibold ml-1 mb-2">Assistant</Text>
                                <View style={{ height: hp(58) }} className="bg-neutral-200 rounded-3xl p-4">
                                    <ScrollView ref={ScrollViewRef} bounces={false} className="space-y-4" showsVerticalScrollIndicator={false}>
                                        {
                                            messages.map((message, index) => {
                                                if (message.role == "assistant") {
                                                    if (message.content.includes('https')) {
                                                        //its an image
                                                        return (
                                                            <View key={index} className="flex-row justify-start">
                                                                <View className="bg-emerald-100 flex rounded-2xl p-2 rounded-tr-none">
                                                                    <Image
                                                                        source={{ uri: message.content }}
                                                                        className="rounded-2xl"
                                                                        resizeMode='contain'
                                                                        style={{ height: wp(60), width: wp(60) }}
                                                                    />
                                                                </View>
                                                            </View>
                                                        )
                                                    }
                                                    else {
                                                        //its a text
                                                        return (
                                                            <View key={index} style={{ width: wp(70) }} className="bg-emerald-100 rounded-xl p-2 rounded-tr-none">
                                                                <Text>{message.content}</Text>
                                                            </View>
                                                        )
                                                    }
                                                }
                                                else {
                                                    //user input
                                                    return (
                                                        <View key={index} className="flex-row justify-end">
                                                            <View style={{ width: wp(70) }} className="bg-white rounded-xl p-2 rounded-tr-none">
                                                                <Text>{message.content}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </>
                    ) : (
                        <Features />
                    )
                }
                {/* recording , clear, stop buttons */}
                <View className={`${messages > 0 ? 'flex' : 'flex-1'} justify-end items-center mb-4`}>
                    {
                        loading ? (
                            <Image source={require('../../assets/images/loading.gif')} style={{ width: hp(10), height: hp(10) }} />
                        ) : recording ? (
                            // gif
                            <TouchableOpacity onPress={stopRecording}>
                                {/* recording stop button */}
                                <Image
                                    className="rounded-full"
                                    source={require('../../assets/images/speakingmic.gif')}
                                    style={{ width: hp(10), height: hp(10) }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={startRecording}>
                                {/* recording start button */}
                                <Image
                                    className="rounded-full"
                                    source={require('../../assets/images/staticmic.png')}
                                    style={{ width: hp(10), height: hp(10) }}
                                />
                            </TouchableOpacity>
                        )
                    }
                    {
                        messages.length > 0 && (
                            <TouchableOpacity onPress={clear} className="bg-neutral-400 absolute right-6 px-3 py-2 rounded-2xl ">
                                <Text style={{ fontSize: wp(6) }} className="font-semibold text-white">Clear</Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        speaking && (
                            <TouchableOpacity onPress={stopSpeaking} className="bg-red-400 absolute left-6 p-2 px-3 py-2 rounded-2xl">
                                <Text style={{ fontSize: wp(8) }} className="font-semibold text-white">Stop</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 60 : 0,
    }
})