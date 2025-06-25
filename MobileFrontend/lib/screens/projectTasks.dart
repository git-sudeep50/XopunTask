import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:task_manager/models/kanbanModels.dart';
import 'package:task_manager/screens/tasksDetailsScreen.dart';
import 'package:task_manager/services/shared_pref_services.dart';
import 'package:task_manager/services/tasksServices.dart';

class TasksTab extends StatefulWidget {
  final String projectid;
  const TasksTab({Key? key, required this.projectid}) : super(key: key);

  @override
  _TasksTabState createState() => _TasksTabState();
}

class _TasksTabState extends State<TasksTab> {
  bool isLoading = true;
  List<KanbanGroup> groups = [];
  final ScrollController _scrollController = ScrollController();
  Offset? _lastDragOffset;
  late final Ticker _ticker;

  @override
  void initState() {
    super.initState();
    loadTasks();

    _ticker = Ticker((_) {
      if (_lastDragOffset == null) return;
      final dx = _lastDragOffset!.dx;
      const edgeThreshold = 80;
      const scrollSpeed = 20;

      if (dx < edgeThreshold) {
        _scrollController.jumpTo(
          (_scrollController.position.pixels - scrollSpeed).clamp(
            0.0,
            _scrollController.position.maxScrollExtent,
          ),
        );
      } else if (dx > MediaQuery.of(context).size.width - edgeThreshold) {
        _scrollController.jumpTo(
          (_scrollController.position.pixels + scrollSpeed).clamp(
            0.0,
            _scrollController.position.maxScrollExtent,
          ),
        );
      }
    });

    _ticker.start();
  }

  
  DateTime? _selectedStartDate;
  DateTime? _selectedDueDate;
  final String _selectedStatus = 'ASSIGNED'; 
  String _selectedPriority = 'LOW';

 

  void _addNewTaskToGroup() async {
    final formKey = GlobalKey<FormState>();
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();

   
    _selectedStartDate = DateTime.now();
    _selectedDueDate = DateTime.now().add(Duration(days: 3));

    _selectedPriority = 'LOW';

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 16,
            right: 16,
            top: 16,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
          ),
          child: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Create Task',
                    style: Theme.of(ctx).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),

                  // Title
                  TextFormField(
                    controller: titleCtrl,
                    decoration: const InputDecoration(labelText: 'Title'),
                    validator:
                        (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  ),

                  // Description
                  TextFormField(
                    controller: descCtrl,
                    decoration: const InputDecoration(labelText: 'Description'),
                    maxLines: 2,
                  ),

                  // Priority
                  DropdownButtonFormField<String>(
                    value: _selectedPriority,
                    decoration: const InputDecoration(labelText: 'Priority'),
                    items:
                        ['LOW', 'MEDIUM', 'HIGH']
                            .map(
                              (p) => DropdownMenuItem(value: p, child: Text(p)),
                            )
                            .toList(),
                    onChanged: (v) => _selectedPriority = v!,
                  ),

                  // Due Date
                  Row(
                    children: [
                      const Text('Due Date:'),
                      TextButton(
                        child: Text(
                          '${_selectedDueDate!.day}/${_selectedDueDate!.month}/${_selectedDueDate!.year}',
                        ),
                        onPressed: () async {
                          final d = await showDatePicker(
                            context: ctx,
                            initialDate: _selectedDueDate!,
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(Duration(days: 365)),
                          );
                          if (d != null) setState(() => _selectedDueDate = d);
                        },
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  ElevatedButton(
                    child: const Text('Create'),
                    onPressed: () async {
                      if (!formKey.currentState!.validate()) return;
                      Navigator.of(ctx).pop();

                      // 3️⃣ Build the request body
                      final owner = await PreferenceHelper.getuserEmail();
                      final body = {
                        'taskName': titleCtrl.text.trim(),
                        'description': descCtrl.text.trim(),
                        'startDate':
                            _selectedStartDate!
                                .toIso8601String()
                                .split('T')
                                .first,
                        'dueDate':
                            _selectedDueDate!
                                .toIso8601String()
                                .split('T')
                                .first,
                        'projectId': widget.projectid,
                        'ownerId': owner,
                        'status': _selectedStatus,
                        'priority': _selectedPriority,
                      };

                      
                      try {
                        await TaskService.createTask(body);
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('✅ Task created successfully'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        }
                        await loadTasks();
                      } catch (e) {
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('❌ Creation failed: $e'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      }
                    },
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  DateTime? _startDate;
  DateTime? _dueDate;
  String _status = 'ASSIGNED';


  @override
  void dispose() {
    _ticker.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> loadTasks() async {
    setState(() => isLoading = true);
    try {
      final tasks = await TaskService.fetchProjectTasks(widget.projectid);
      Map<String, List<KanbanGroupItem>> map = {
        'assigned': [],
        'in_progress': [],
        'completed': [],
        'exceeded': [],
      };

      for (var t in tasks) {
        final status =
            t.status.toLowerCase() == 'progress'
                ? 'in_progress'
                : t.status.toLowerCase();

        final assignedInitials = t.assignedTo
            .map((email) => email.isNotEmpty ? email[0].toUpperCase() : '')
            .join(', ');

        map[status]?.add(
          KanbanGroupItem(
            id: t.id,
            title: t.title,
            subtitle: 'Assigned: $assignedInitials',
            color:
                status == 'assigned'
                    ? Colors.blue.shade50
                    : status == 'in_progress'
                    ? Colors.orange.shade50
                    : status == 'completed'
                    ? Colors.green.shade50
                    : Colors.red.shade100,
            priority: t.priority,
            dueDate: t.dueDate,
            owner: t.ownerId,
            assignedUserEmails: t.assignedTo,
          ),
        );
      }

      groups = [
        KanbanGroup(id: 'assigned', name: 'Assigned', items: map['assigned']!),
        KanbanGroup(
          id: 'in_progress',
          name: 'In Progress',
          items: map['in_progress']!,
        ),
        KanbanGroup(
          id: 'completed',
          name: 'Completed',
          items: map['completed']!,
        ),
        KanbanGroup(id: 'exceeded', name: 'Exceeded', items: map['exceeded']!),
      ];
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Failed to load tasks: $e"),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> _onDrop(KanbanGroupItem item, String toGroupId) async {
    final from = groups.firstWhere((g) => g.items.any((i) => i.id == item.id));
    final to = groups.firstWhere((g) => g.id == toGroupId);

    setState(() {
      from.items.removeWhere((i) => i.id == item.id);
      to.items.add(item);
    });

    final statusMap = {
      'assigned': 'ASSIGNED',
      'in_progress': 'PROGRESS',
      'completed': 'COMPLETED',
      'exceeded': 'EXCEEDED',
    };
    final newStatus = statusMap[toGroupId]!;

    try {
      await TaskService.updateTaskStatus(item.id, newStatus);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Moved to ${to.name}"),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      setState(() {
        to.items.removeWhere((i) => i.id == item.id);
        from.items.add(item);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Update failed. Reverted."),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget _buildCard(KanbanGroupItem item) {
    Color? tagColor;
    final priority = item.priority?.toLowerCase();
    if (priority == 'high')
      tagColor = Colors.red;
    else if (priority == 'medium')
      tagColor = Colors.orange;
    else if (priority == 'low')
      tagColor = Colors.green;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: item.color,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item.title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            if (item.owner != null && item.owner!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 4.0),
                child: Row(
                  children: [
                    const Icon(
                      Icons.person_outline,
                      size: 14,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "Owner: ${item.owner}",
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 6),

            // Assigned avatars
            Wrap(
              spacing: 6,
              children:
                  item.assignedUserEmails.map((email) {
                    final initial =
                        email.trim().isNotEmpty ? email[0].toUpperCase() : '?';
                    return CircleAvatar(
                      radius: 12,
                      backgroundColor: Colors.grey.shade300,
                      child: Text(
                        initial,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    );
                  }).toList(),
            ),

            const SizedBox(height: 8),

            Row(
              children: [
                if (item.dueDate != null)
                  Row(
                    children: [
                      const Icon(
                        Icons.calendar_today,
                        size: 14,
                        color: Colors.grey,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        "${item.dueDate!.day}/${item.dueDate!.month}/${item.dueDate!.year}",
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                const Spacer(),
                if (item.priority != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: tagColor?.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      item.priority!.toUpperCase(),
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: tagColor,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildColumn(KanbanGroup group) {
    return SizedBox(
      width: 350,
      child: Container(
        margin: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade400),
          borderRadius: BorderRadius.circular(8),
        ),
        child: DragTarget<KanbanGroupItem>(
          onWillAccept: (_) => true,
          onAccept: (item) => _onDrop(item, group.id),
          builder: (ctx, candidate, rejected) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color:
                        group.id == 'assigned'
                            ? Colors.blue.shade100
                            : group.id == 'in_progress'
                            ? Colors.orange.shade100
                            : group.id == 'completed'
                            ? Colors.green.shade100
                            : Colors.red.shade200,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(8),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      group.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
                const Divider(height: 1),
                Expanded(
                  child: Listener(
                    onPointerMove: (event) => _lastDragOffset = event.position,
                    onPointerUp: (_) => _lastDragOffset = null,
                    child: ListView(
                      padding: const EdgeInsets.all(8),
                      children:
                          group.items.map((item) {
                            return LongPressDraggable<KanbanGroupItem>(
                              data: item,
                              feedback: Material(
                                elevation: 4,
                                child: SizedBox(
                                  width: 280,
                                  child: _buildCard(item),
                                ),
                              ),
                              child: GestureDetector(
                                onDoubleTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (_) => TaskDetailsScreen(
                                            taskId: item.id,
                                          ),
                                    ),
                                  );
                                },
                                child: _buildCard(item),
                              ),
                            );
                          }).toList(),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addNewTaskToGroup,
        icon: const Icon(Icons.add),
        label: const Text("Add Task"),
      ),
      body:
          isLoading
              ? const Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                controller: _scrollController,
                scrollDirection: Axis.horizontal,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: groups.map(_buildColumn).toList(),
                ),
              ),
    );
  }
}
