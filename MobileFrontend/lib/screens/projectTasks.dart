import 'package:flutter/material.dart';
import 'package:kanban_board/kanban_board.dart';

final List<Map<String, dynamic>> groupData = [
  {"id": "assigned", "name": "  Assigned", "color": Colors.blue.shade50},
  {"id": "in_progress", "name": "  In Progress", "color": Colors.orange.shade50},
  {"id": "completed", "name": "  Completed", "color": Colors.green.shade50},
];

class KanbanGroupItem extends KanbanBoardGroupItem {
  final String itemId;
  final String title;
  final String? subtitle;
  final String? tag;
  final Color? tagColor;
  final String? dueDate;

  KanbanGroupItem({
    required this.itemId,
    required this.title,
    this.subtitle,
    this.tag,
    this.tagColor,
    this.dueDate,
  });

  @override
  String get id => itemId;
}

class TasksTab extends StatefulWidget {
  const TasksTab({super.key});

  @override
  State<TasksTab> createState() => _TasksTabState();
}

class _TasksTabState extends State<TasksTab> {
  final KanbanBoardController _controller = KanbanBoardController();
  late List<KanbanBoardGroup<String, KanbanGroupItem>> kanbanGroups;

  @override
  void initState() {
    super.initState();
    kanbanGroups = groupData.map((data) {
      return KanbanBoardGroup<String, KanbanGroupItem>(
        id: data['id'] as String,
        name: data['name'] as String,
        items: List.generate(3, (i) {
          return KanbanGroupItem(
            itemId: "${data['id']}_item_$i",
            title: "Task ${i + 1}",
            subtitle: "Assigned to: John",
            tag: i % 2 == 0 ? "Urgent" : "Low Priority",
            tagColor: i % 2 == 0 ? Colors.red : Colors.green,
            dueDate: "June ${28 + i}",
          );
        }),
      );
    }).toList();
  }

  void _addNewTaskToGroup(String groupId) {
    final group = kanbanGroups.firstWhere((g) => g.id == groupId);
    final newTask = KanbanGroupItem(
      itemId: "${groupId}_item_${group.items.length}",
      title: "New Task",
      subtitle: "Assigned to: You",
      tag: "Normal",
      tagColor: Colors.blue,
      dueDate: "July 1",
    );
    setState(() {
      group.items.add(newTask);
    });
  }

  @override
  Widget build(BuildContext context) {
    return KanbanBoard(
      groupDecoration: BoxDecoration(
        border: Border.all(color: Colors.black),
        borderRadius: BorderRadius.circular(15),
      ),
      controller: _controller,
      groups: kanbanGroups,
      groupItemBuilder: _groupItemBuilder,
      groupFooterBuilder: (ctx, groupId) {
        return TextButton.icon(
          onPressed: () => _addNewTaskToGroup(groupId),
          icon: const Icon(Icons.add),
          label: const Text("Add Task"),
        );
      },
      onGroupItemMove: (oldG, oldI, newG, newI) {
        if (oldG == null || oldI == null || newG == null || newI == null)
          return;
        setState(() {
          final item = kanbanGroups[oldG].items.removeAt(oldI);
          kanbanGroups[newG].items.insert(newI, item);
        });
      },
      onGroupMove: (oldG, newG) {
        // Optional: handle column reordering
      },
    );
  }

  Widget _groupItemBuilder(BuildContext context, String groupId, int itemIndex) {
    final gIdx = kanbanGroups.indexWhere((g) => g.id == groupId);
    final item = kanbanGroups[gIdx].items[itemIndex];
    final bg = groupData[gIdx]['color'] as Color;

    return Material(
      color: Colors.transparent,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [
            BoxShadow(color: Colors.grey, blurRadius: 4, offset: Offset(0, 3)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            if (item.subtitle != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(item.subtitle!, style: const TextStyle(color: Colors.grey, fontSize: 13)),
              ),
            const SizedBox(height: 6),
            Row(
              children: [
                if (item.dueDate != null)
                  Text("Due: ${item.dueDate}", style: TextStyle(fontSize: 12, color: Colors.grey[700])),
                const Spacer(),
                if (item.tag != null)
                  Icon(Icons.flag, size: 16, color: item.tagColor ?? Colors.blue),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
