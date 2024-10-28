
// esta se puede ser el Splash
// y hacer algo cuando cargue la aplicacion

import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";


export default function MainScreen() {

    // al cargarse, validad la sesion (recargar sesion)

    //edtado para determinar que ya se cargo la aplocacion
    
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (loaded) {
            router.replace("/auth/login");
        }
        
    }, [loaded]);

    useEffect(() => {
        setLoaded(true);
    }, []);
    // definir a donde llevar el usuario
    //router.replace()
    return (
        <View>
            <Text>
                Mi aplicacion...
            </Text>
        </View>
    )
}