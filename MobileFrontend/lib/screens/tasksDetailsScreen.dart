import 'package:flutter/material.dart';
import 'package:task_manager/models/tasksModel.dart';
import 'package:task_manager/services/tasksServices.dart';

class TaskDetailsScreen extends StatelessWidget {
  final String taskId;

  const TaskDetailsScreen({Key? key, required this.taskId}) : super(key: key);

  Future<Task> _fetchTaskDetails() async {
    return await TaskService.fetchTaskById(taskId);
  }

  void _showAssignDialog(BuildContext context) async {
    final emailCtrl = TextEditingController();
    await showDialog(
      context: context,
      builder:
          (ctx) => AlertDialog(
            title: const Text('Assign Task'),
            content: TextField(
              controller: emailCtrl,
              decoration: const InputDecoration(
                labelText: 'User email(s)',
                hintText: 'comma-separated',
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () async {
                  final raw = emailCtrl.text.trim();
                  if (raw.isEmpty) return;
                  final emails =
                      raw
                          .split(',')
                          .map((s) => s.trim())
                          .where((s) => s.isNotEmpty)
                          .toList();
                  Navigator.pop(ctx); // close dialog
                  try {
                    await TaskService.assignTask(taskId, emails);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('✅ Task assigned'),
                        backgroundColor: Colors.green,
                      ),
                    );
                    await _fetchTaskDetails(); // refresh your UI
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('❌ Failed to assign: $e'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                },
                child: const Text('Assign'),
              ),
            ],
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Task Details')),
      body: FutureBuilder<Task>(
        future: _fetchTaskDetails(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final task = snapshot.data!;
          return Padding(
            padding: const EdgeInsets.all(16),
            child: ListView(
              children: [
                Text(task.title, style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 10),
                Text("Owner: ${task.ownerId}"),
                const SizedBox(height: 8),
                Text("Priority: ${task.priority}"),
                const SizedBox(height: 8),
                Text("Status: ${task.status}"),
                const SizedBox(height: 8),
                Text(
                  "Due Date: ${task.dueDate?.toLocal().toString().split(' ')[0] ?? "N/A"}",
                ),
                const SizedBox(height: 8),
                Text("Assigned to: ${task.assignedTo.join(', ')}"),
                const SizedBox(height: 16),
                Text("Description:\n${task.description ?? "No Description"}"),
                ElevatedButton.icon(
                  onPressed: () {
                    _showAssignDialog(context);
                  },
                  icon: const Icon(Icons.person_add),
                  label: const Text('Assign to User'),
                ),
                const SizedBox(height: 16),
              ],
            ),
          );
        },
      ),
    );
  }
}
