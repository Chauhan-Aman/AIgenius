import { Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {

    const [currentTime, setCurrentTime] = useState('');
    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = dayNames[date.getDay()];
            const formattedDayName = dayName.split('').map(letter => letter.toUpperCase()).join('.');

            setCurrentDay(formattedDayName);

            setCurrentTime(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const navigation = useNavigation();

    return (
        <View className="flex-1 flex justify-around bg-gray-900">
            <View className="space-y-2 mt-24">
                <Text style={{ fontSize: wp(10) }} className="text-center font-bold text-white">{currentDay}</Text>
                <Text className=" text-white text-xl text-center">{currentTime}</Text>
            </View>
            <View className="flex-col justify-center text-center items-center">
                <Image source={require('../../assets/images/Ai-Logo.png')} className="w-80 h-80" />
                <Text style={{ fontSize: wp(4.2) }} className="text-center tracking-wider text-gray-300 font-semibold">The Future is here, powered by AI.</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} className="bg-emerald-600 mx-5 p-4 rounded-2xl">
                <Text style={{ fontSize: wp(6) }} className="text-center font-bold text-white">Get Started</Text>
            </TouchableOpacity>
        </View>
    )
}

export default WelcomeScreen