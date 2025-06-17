import 'package:flutter/material.dart';
import 'package:icons_plus/icons_plus.dart';
import 'package:task_manager/screens/homepage.dart';
import 'package:task_manager/screens/myprojectsScreen.dart';

class Tabsscreen extends StatefulWidget {
  const Tabsscreen({super.key});

  @override
  State<Tabsscreen> createState() => _TabsscreenState();
}

class _TabsscreenState extends State<Tabsscreen> {
  int _currentindex = 0;
  final List<Widget> _screens = [
    Homepage(),
    Myprojectsscreen(),
    Homepage(),
    Homepage(),
  ];

  void _selectab(int index) {
    setState(() {
      _currentindex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentindex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        onTap: _selectab,
        currentIndex: _currentindex,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(HeroIcons.rocket_launch),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: "Home",
          ),
        ],
      ),
    );
  }
}
