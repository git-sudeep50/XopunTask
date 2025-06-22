import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:task_manager/screens/loginScreen.dart';
import 'package:task_manager/screens/tabsScreen.dart';
import 'package:task_manager/services/shared_pref_services.dart';

void main() {
  runApp(App());
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  Widget _mainContent = Tabsscreen();

  @override
  void initState() {
    super.initState();

    isLoggedIn(); // Only called once here
  }

  void isLoggedIn() async {
    
    bool status = await PreferenceHelper.isLoggedIn();
    
    setState(() {
      if (status == true) {
        _mainContent = Tabsscreen();
      } else {
        _mainContent = AuthScreen(loggedIn: isLoggedIn,);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: "Task Manager",
        home: _mainContent,
      ),
    );
  }
}
