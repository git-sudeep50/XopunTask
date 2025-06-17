class Task {
  final String id;
  final String title;
  final String description;
  final String status; // "Todo", "In Progress", "Done", "Deadline"
  final String priority; // "Low", "Medium", "High"
  final String assignedTo;
  final DateTime dueDate;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.priority,
    required this.assignedTo,
    required this.dueDate,
  });
}

List<Task> dummyTasks = [
  Task(
    id: '1',
    title: 'Design Login Screen',
    description: 'Create UI for login with Flutter and Figma reference',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'Alice',
    dueDate: DateTime.now().add(Duration(days: 2)),
  ),
  Task(
    id: '2',
    title: 'Setup Firebase Auth',
    description: 'Integrate Firebase Email/Password login',
    status: 'Todo',
    priority: 'Medium',
    assignedTo: 'Bob',
    dueDate: DateTime.now().add(Duration(days: 4)),
  ),
  Task(
    id: '3',
    title: 'Fix Scroll Bug',
    description: 'Resolve overflow issue on homepage scroll',
    status: 'Done',
    priority: 'Low',
    assignedTo: 'Charlie',
    dueDate: DateTime.now().subtract(Duration(days: 1)),
  ),
  Task(
    id: '4',
    title: 'Create Project Model',
    description: 'Add data class and mock list for local testing',
    status: 'Deadline',
    priority: 'High',
    assignedTo: 'Diana',
    dueDate: DateTime.now().add(Duration(hours: 12)),
  ),
  Task(
    id: '5',
    title: 'Write Unit Tests',
    description: 'Cover auth service and utils',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'Ethan',
    dueDate: DateTime.now().add(Duration(days: 3)),
  ),
];
