// lib/models/tasksModel.dart

class Task {
  final String id;
  final String title;
  final String description;
  final String ownerId;
  final String status;
  final String priority;
  final DateTime startDate;
  final DateTime dueDate;
  final List<String> assignedTo;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.ownerId,
    required this.status,
    required this.priority,
    required this.startDate,
    required this.dueDate,
    required this.assignedTo,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    // Safely grab UserTasks; if it's null or missing, default to an empty list
    final rawUserTasks = json['UserTasks'] as List<dynamic>?;
    final assigned =
        rawUserTasks?.map((e) => e['userId'].toString()).toList() ?? <String>[];

    return Task(
      id: json['tid'] as String,
      title: json['tname'] as String,
      description: (json['description'] ?? '') as String,
      ownerId: json['ownerId'] as String,
      status: json['status'] as String,
      priority: json['priority'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      dueDate: DateTime.parse(json['dueDate'] as String),
      assignedTo: assigned,
    );
  }
}

// If you still need a dummy list:
List<Task> dummyTasks = [];
