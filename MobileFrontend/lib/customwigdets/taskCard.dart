import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:icons_plus/icons_plus.dart';
import 'package:task_manager/models/tasksModel.dart';

class Taskcard extends StatefulWidget {
  const Taskcard({super.key, required this.task});

  final Task task;

  @override
  State<Taskcard> createState() => _TaskcardState();
}

class _TaskcardState extends State<Taskcard> {
  Color getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return const Color.fromARGB(213, 239, 83, 40); // red
      case 'medium':
        return const Color.fromARGB(178, 255, 168, 40); // orange
      case 'low':
        return const Color.fromARGB(255, 102, 187, 40); // green
      default:
        return Colors.grey; // fallback
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      child: Container(
        padding: EdgeInsets.all(8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: EdgeInsets.symmetric(vertical: 2, horizontal: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: getPriorityColor(widget.task.priority),
                  ),
                  child: Text(
                    widget.task.priority,
                    style: TextStyle(fontSize: 16),
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  widget.task.title,
                  style: GoogleFonts.montserrat(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    text: "Deadline: ",
                    style: TextStyle(color: Colors.black),
                    children: [
                      TextSpan(
                        text:
                            "${widget.task.dueDate.day.toString()}/${widget.task.dueDate.month.toString()}/${widget.task.dueDate.year.toString()}",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Icon(HeroIcons.arrow_right_circle, size: 26, color: Colors.blue),
          ],
        ),
      ),
    );
  }
}
