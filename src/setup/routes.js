import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Ionity from '../screens/Ionity/index';
import Tesla from '../screens/Tesla/index';
import Combined from '../screens/Combined/index';

const RootStack = createBottomTabNavigator({
    Ionity: Ionity,
    Tesla: Tesla,
    Combined: Combined
}, {
    tabBarOptions: {
        activeTintColor: '#000',
        inactiveTintColor: 'gray',
        style: {
            backgroundColor: '#fff',
        },
        indicatorStyle: {
            backgroundColor: '#000',
        },
    }
});

const App = createAppContainer(RootStack);

export default App;
