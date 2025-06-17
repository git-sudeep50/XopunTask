import 'package:flutter/material.dart';
import 'package:icons_plus/icons_plus.dart';
import 'package:task_manager/customwigdets/taskCard.dart';
import 'package:task_manager/models/tasksModel.dart';

class Myprojectsscreen extends StatefulWidget {
  const Myprojectsscreen({super.key});

  @override
  State<Myprojectsscreen> createState() => _MyprojectsscreenState();
}

class _MyprojectsscreenState extends State<Myprojectsscreen> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final cardWidth = size.width / 2.2;

    return Scaffold(
      body: Container(
        color: const Color.fromARGB(64, 0, 200, 255),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 36),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Image.asset(
                  "assets/images/profileimage.png",
                  fit: BoxFit.contain,
                  height: 50,
                ),
                const Icon(HeroIcons.bell_alert, size: 32),
              ],
            ),

            SizedBox(height: 22),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Recent Projects",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                Text(
                  "See All",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 0, 91, 194),
                  ),
                ),
              ],
            ),
            Expanded(
              child: ListView(
                children: [
                  Taskcard(task: dummyTasks[1]),
                  
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
