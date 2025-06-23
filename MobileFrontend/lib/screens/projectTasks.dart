import 'package:flutter/material.dart';
import 'package:task_manager/models/projectsModel.dart';

class TasksTab extends StatelessWidget {
  final Project project;
  final String role;

  const TasksTab({super.key, required this.project, required this.role});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Tasks for ${project.pname}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Expanded(
            child: ListView(
              children: const [
                // TODO: Replace with your actual tasks list
                ListTile(
                  leading: Icon(Icons.task_alt),
                  title: Text("Sample Task 1"),
                  subtitle: Text("Assigned to: user@example.com"),
                ),
              ],
            ),
          ),
          if (role == 'OWNER')
            ElevatedButton.icon(
              onPressed: () {
                // TODO: open task creation dialog
              },
              icon: const Icon(Icons.add),
              label: const Text("Assign New Task"),
            ),
        ],
      ),
    );
  }
}
