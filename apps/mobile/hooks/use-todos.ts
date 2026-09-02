import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export function useTodos() {
  const query = useQuery(orpc.todo.getAll.queryOptions());
  const refresh = () => query.refetch();

  const create = useMutation(orpc.todo.create.mutationOptions({ onSuccess: refresh }));
  const toggle = useMutation(orpc.todo.toggle.mutationOptions({ onSuccess: refresh }));
  const remove = useMutation(orpc.todo.delete.mutationOptions({ onSuccess: refresh }));

  return {
    ...query,
    taskList: query.data ?? [],
    create,
    toggle,
    remove,
  };
}
