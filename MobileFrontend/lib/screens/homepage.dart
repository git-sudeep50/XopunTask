import 'package:flutter/material.dart';
import 'package:icons_plus/icons_plus.dart';
import 'package:task_manager/customwigdets/statuscard.dart';
import 'package:task_manager/customwigdets/taskCard.dart';
import 'package:task_manager/models/tasksModel.dart';
import 'package:task_manager/services/shared_pref_services.dart';

class Homepage extends StatefulWidget {
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  String name = " User";
  void initState() {
    super.initState();

    _getUserName(); // Only called once here
  }

  void _getUserName() async {
    String _name = await PreferenceHelper.getName();
    setState(() {
      name = _name;
    });
  }
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final cardWidth = size.width / 2.2;

    return Scaffold(
      body: Container(
        color: const Color.fromARGB(64, 150, 223, 244),
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
            const SizedBox(height: 10),
            RichText(
              text: TextSpan(
                text: 'Hello',
                style: const TextStyle(
                  fontSize: 30,
                  color: Color.fromARGB(101, 0, 0, 0),
                ),
                children: [
                  TextSpan(
                    text: ' $name👋',
                    style: TextStyle(
                      fontSize: 40,
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                StatusCard(title: 'Todo', color: Colors.blue, width: cardWidth),
                const Spacer(),
                StatusCard(
                  title: 'Ongoing',
                  color: Colors.deepPurple,
                  width: cardWidth,
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                StatusCard(
                  title: 'Done',
                  color: Colors.green,
                  width: cardWidth,
                ),
                const Spacer(),
                StatusCard(
                  title: 'Urgent',
                  color: const Color.fromARGB(255, 240, 39, 24),
                  width: cardWidth,
                ),
              ],
            ),
            SizedBox(height: 22),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Recent Tasks",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                Text(
                  "See All",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
            Expanded(
              child: ListView.builder(
                itemCount: dummyTasks.length,
                itemBuilder:
                    (context, index) => Taskcard(task: dummyTasks[index]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
