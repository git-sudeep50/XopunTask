import 'dart:ui';

class KanbanGroupItem {
  final String id;
  final String title;
  final String subtitle;
  final Color color;
  final String? owner;
  final List<String> assignedUserEmails;
  final String? priority;
  final DateTime? dueDate;

  KanbanGroupItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.color,
    this.owner,
    required this.assignedUserEmails,
    this.priority,
    this.dueDate,
  });
}



class KanbanGroup {
  final String id, name;
  List<KanbanGroupItem> items;
  KanbanGroup({required this.id, required this.name, required this.items});
}