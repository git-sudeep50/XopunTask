import 'package:flutter/material.dart'; 
import 'package:kanban_board/kanban_board.dart';
import 'package:task_manager/models/projectsModel.dart';
import 'package:task_manager/services/shared_pref_services.dart';
import 'package:task_manager/services/tasksServices.dart';

final List<Map<String, dynamic>> groupData = [
  {"id": "assigned", "name": "  Assigned", "color": Colors.blue.shade50},
  {
    "id": "in_progress",
    "name": "  In Progress",
    "color": Colors.orange.shade50,
  },
  {"id": "completed", "name": "  Completed", "color": Colors.green.shade50},
  {"id": "exceeded", "name": "  Exceeded", "color": Colors.red.shade100},
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

/// Maps backend task status to Kanban group ID
String normalizeStatus(String rawStatus) {
  switch (rawStatus.toUpperCase()) {
    case 'ASSIGNED':
      return 'assigned';
    case 'PROGRESS':
      return 'in_progress';
    case 'COMPLETED':
      return 'completed';
    case 'EXCEEDED':
  return 'exceeded'; // Or handle this separately if needed
    default:
      return 'assigned'; // fallback
  }
}

class TasksTab extends StatefulWidget {
  TasksTab({super.key, required this.projectid});

  final String projectid;

  @override
  State<TasksTab> createState() => _TasksTabState();
}

class _TasksTabState extends State<TasksTab> {
  final KanbanBoardController _controller = KanbanBoardController();

  @override
  @override
  void initState() {
    super.initState();
    loadTasks();
  }

  bool isLoading = true;
  List<KanbanBoardGroup<String, KanbanGroupItem>> kanbanGroups = [];

  Future<void> loadTasks() async {
    try {
      final tasks = await TaskService.fetchProjectTasks(widget.projectid);

      // Initialize empty groups
      final Map<String, List<KanbanGroupItem>> groupItems = {
        "assigned": [],
        "in_progress": [],
        "completed": [],
      };

      for (final task in tasks) {
        final groupId = normalizeStatus(task.status);
        groupItems[groupId]!.add(
          KanbanGroupItem(
            itemId: task.id,
            title: task.title,
            subtitle: "Assigned to: ${task.assignedTo}",
            tag: task.priority,
            tagColor:
                task.priority.toLowerCase() == 'high'
                    ? Colors.red
                    : task.priority.toLowerCase() == 'medium'
                    ? Colors.orange
                    : Colors.green,
            dueDate: "${task.dueDate.day}/${task.dueDate.month}",
          ),
        );
      }

      // Create Kanban groups using your existing groupData
      setState(() {
        kanbanGroups =
            groupData.map((data) {
              final groupId = data["id"] as String;
              return KanbanBoardGroup<String, KanbanGroupItem>(
                id: groupId,
                name: data["name"],
                items: groupItems[groupId] ?? [],
              );
            }).toList();

        isLoading = false;
      });
    } catch (e) {
      print("Error loading tasks: $e");
      setState(() => isLoading = false);
    }
  }

  void _addNewTaskToGroup(String groupId) async {
    final statusMap = {
      "assigned": "ASSIGNED",
      "in_progress": "IN_PROGRESS",
      "completed": "COMPLETED",
    };

    final formKey = GlobalKey<FormState>();
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    String selectedPriority = 'LOW';
    DateTime selectedDueDate = DateTime.now().add(Duration(days: 3));

    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Create New Task"),
          content: Form(
            key: formKey,
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: titleController,
                    decoration: const InputDecoration(labelText: "Task Title"),
                    validator:
                        (value) =>
                            value == null || value.isEmpty
                                ? "Title required"
                                : null,
                  ),
                  TextFormField(
                    controller: descriptionController,
                    decoration: const InputDecoration(labelText: "Description"),
                    maxLines: 2,
                  ),
                  DropdownButtonFormField<String>(
                    value: selectedPriority,
                    items:
                        ['LOW', 'MEDIUM', 'HIGH']
                            .map(
                              (p) => DropdownMenuItem(value: p, child: Text(p)),
                            )
                            .toList(),
                    onChanged: (value) {
                      if (value != null) selectedPriority = value;
                    },
                    decoration: const InputDecoration(labelText: "Priority"),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Text("Due Date: "),
                      TextButton(
                        child: Text(
                          "${selectedDueDate.day}/${selectedDueDate.month}/${selectedDueDate.year}",
                        ),
                        onPressed: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: selectedDueDate,
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(Duration(days: 365)),
                          );
                          if (picked != null) {
                            selectedDueDate = picked;
                          }
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              child: const Text("Create"),
              onPressed: () async {
                if (formKey.currentState!.validate()) {
                  Navigator.pop(context);
                  await _submitTask(
                    groupId: groupId,
                    title: titleController.text,
                    description: descriptionController.text,
                    priority: selectedPriority,
                    dueDate: selectedDueDate,
                  );
                }
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _submitTask({
  required String groupId,
  required String title,
  required String description,
  required String priority,
  required DateTime dueDate,
}) async {
  final statusMap = {
    "assigned": "ASSIGNED",
    "in_progress": "IN_PROGRESS",
    "completed": "COMPLETED",
  };

  
  final userEmail = await PreferenceHelper.getuserEmail();

  final body = {
    "taskName": title,
    "description": description,
    "startDate": DateTime.now().toIso8601String().split("T").first,
    "dueDate": dueDate.toIso8601String().split("T").first,
    "projectId": widget.projectid,
    "ownerId": userEmail, 
    "status": statusMap[groupId]!,
    "priority": priority,
  };

  try {
    await TaskService.createTask(body);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(" Task created successfully"),
          backgroundColor: Colors.green,
        ),
      );
    }

    await loadTasks();
  } catch (e) {
    print("Error creating task: $e");
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(" Task creation failed"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}

  

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return KanbanBoard(
      groupDecoration: BoxDecoration(
        border: Border.all(color: Colors.black),
        borderRadius: BorderRadius.circular(15),
      ),
      controller: _controller,
      groups: kanbanGroups,
      groupItemBuilder: _groupItemBuilder,
      groupFooterBuilder: (ctx, groupId) {
        if (groupId == 'assigned') {
          return TextButton.icon(
            onPressed: () => _addNewTaskToGroup(groupId),
            icon: const Icon(Icons.add),
            label: const Text("Add Task"),
          );
        } else {
          return const SizedBox.shrink(); // empty footer for other groups
        }
      },

     onGroupItemMove: (oldGroupId, oldIndex, newGroupId, newIndex) async {
  if (oldGroupId == null || oldIndex == null || newGroupId == null || newIndex == null) return;

  final oldGroup = kanbanGroups.firstWhere((g) => g.id == oldGroupId);
  final newGroup = kanbanGroups.firstWhere((g) => g.id == newGroupId);

  // Safety check
  if (oldIndex < 0 || oldIndex >= oldGroup.items.length) return;

  // Get the moved task
  final movedItem = oldGroup.items.removeAt(oldIndex);

  // Insert into new group
  if (newIndex < 0 || newIndex > newGroup.items.length) {
    newGroup.items.add(movedItem);
  } else {
    newGroup.items.insert(newIndex, movedItem);
  }

  setState(() {}); 

  
  final statusMap = {
    'assigned': 'ASSIGNED',
    'in_progress': 'PROGRESS',
    'completed': 'COMPLETED',
    'exceeded': 'EXCEEDED',
  };

  final newStatus = statusMap[newGroup.id];

  try {
    await TaskService.updateTaskStatus(movedItem.id, newStatus!);
    print("Task ${movedItem.id} updated to $newStatus");
  } catch (e) {
    print(" API failed: $e");

    // Rollback UI
    newGroup.items.remove(movedItem);
    oldGroup.items.insert(oldIndex, movedItem);
    setState(() {});
  }
}




    );
  }

  Widget _groupItemBuilder(
    BuildContext context,
    String groupId,
    int itemIndex,
  ) {
    final gIdx = kanbanGroups.indexWhere((g) => g.id == groupId);
    final item = kanbanGroups[gIdx].items[itemIndex];
    final bg = groupData[gIdx]['color'] as Color;

    return Material(
      color: Colors.transparent,
      child: Container(
       
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
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
            Text(
              item.title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            if (item.subtitle != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  item.subtitle!,
                  style: const TextStyle(color: Colors.grey, fontSize: 13),
                ),
              ),
            const SizedBox(height: 6),
            Row(
              children: [
                if (item.dueDate != null)
                  Text(
                    "Due: ${item.dueDate}",
                    style: TextStyle(fontSize: 12, color: Colors.grey[700]),
                  ),
                const Spacer(),
                if (item.tag != null)
                  Icon(
                    Icons.flag,
                    size: 16,
                    color: item.tagColor ?? Colors.blue,
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}