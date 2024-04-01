import { Text, View, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'

const Features = () => {
    return (
        <View style={{ height: hp(60) }} className="space-y-4">
            <Text style={{ fontSize: wp(6.5) }} className="font-semibold text-gray-200 mt-4">Features</Text>
            <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../../assets/images/chatgptlogo.jpg')} style={{ height: hp(4), width: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">ChatGPT</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="text-gray-700 font-medium">
                    ChatGPT, an AI model by OpenAI. Trained on diverse text, I generate human-like responses. I assist with questions, create content, and aim to engage users effectively.
                </Text>
            </View>
            <View className="bg-sky-300 p-4 rounded-xl space-y-2">
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../../assets/images/Dall-E Logo.jpg')} style={{ height: hp(3.6), width: hp(3.6) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">DALL-E</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="text-gray-700 font-medium">
                    DALL-E is an AI model by OpenAI specialized in generating images from textual descriptions. It can create surreal and imaginative visual content based on the input it receives.
                </Text>
            </View>
            <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../../assets/images/Ai-Logo.png')} style={{ height: hp(4), width: hp(4) }} />
                    <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">Smart AI</Text>
                </View>
                <Text style={{ fontSize: wp(3.8) }} className="text-gray-700 font-medium">
                    Smart AI by OpenAI: text-to-speech, speech-to-text, and intelligent responses. Empowers users with advanced capabilities in natural language understanding.
                </Text>
            </View>
        </View >
    )
}

export default Features