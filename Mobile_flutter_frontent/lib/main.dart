import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:task_manager/screens/homepage.dart';
import 'package:task_manager/screens/tabsScreen.dart';

void main() {
  runApp(App());
}

class App extends StatelessWidget {
  const App({super.key});

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
        home: Tabsscreen(),
      ),
    );
  }
}
