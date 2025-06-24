import 'package:flutter/material.dart';
import 'package:task_manager/models/tasksModel.dart';
import 'package:task_manager/services/tasksServices.dart';

class NewPage extends StatefulWidget {
  const NewPage({super.key});

  @override
  State<NewPage> createState() => _NewPageState();
}

class _NewPageState extends State<NewPage> {
  List<Task> tasks = [];
  bool isLoading = true;

@override
void initState() {
  super.initState();
  loadTasks();
}

Future<void> loadTasks() async {
  try {
    tasks = await TaskService.fetchProjectTasks("efbfdd75-a99e-444b-8d64-d6255dea0f19");
  } catch (e) {
    print('Error fetching tasks: $e');
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Failed to load tasks')),
    );
  } finally {
    setState(() => isLoading = false);
  }
}


  @override
Widget build(BuildContext context) {
  return isLoading
        ? Center(child: CircularProgressIndicator())
        : ListView.builder(
            itemCount: tasks.length,
            itemBuilder: (context, index) {
              final task = tasks[index];
              return ListTile(
                title: Text(task.title),
                subtitle: Text("Status: ${task.status} | Priority: ${task.priority}"),
              );
            },
          );
  
}

    
}
