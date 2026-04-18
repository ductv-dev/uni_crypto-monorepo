import { TPermissionGroup, TRolePermissionsResponse } from "@/types/role.type"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

// Query key gốc để cache quyền theo từng role trong React Query.
export const ROLE_PERMISSIONS_QUERY_KEY = "role-permissions"

// Danh sách toàn bộ quyền có thể gán cho một role.
// UI dùng mảng này để render checkbox theo từng nhóm chức năng.
export const PERMISSION_GROUPS: TPermissionGroup[] = [
  {
    module: "Bảng điều khiển",
    actions: ["Xem bảng điều khiển"],
  },
  {
    module: "Quản lý người dùng",
    actions: [
      "Xem người dùng",
      "Tạo người dùng",
      "Chỉnh sửa người dùng",
      "Xóa người dùng",
      "Quản lý KYC",
    ],
  },
  {
    module: "Giao dịch",
    actions: ["Xem giao dịch", "Duyệt giao dịch", "Từ chối giao dịch"],
  },
  {
    module: "Tài sản & ví",
    actions: ["Xem ví", "Quản lý tài sản"],
  },
  {
    module: "Cài đặt",
    actions: ["Xem cài đặt", "Chỉnh sửa cài đặt"],
  },
]

// Mock dữ liệu quyền hiện tại của từng role.
// Key là roleId, value là danh sách action đã được cấp.
const MOCK_ROLE_PERMISSIONS: Record<string, string[]> = {
  "ROL-001": PERMISSION_GROUPS.flatMap((group) => group.actions),
  "ROL-002": [
    "Xem bảng điều khiển",
    "Xem người dùng",
    "Tạo người dùng",
    "Chỉnh sửa người dùng",
    "Xem giao dịch",
    "Duyệt giao dịch",
    "Xem ví",
    "Quản lý tài sản",
    "Xem cài đặt",
  ],
  "ROL-003": ["Xem bảng điều khiển", "Xem người dùng", "Xem giao dịch"],
  "ROL-004": [
    "Xem bảng điều khiển",
    "Xem người dùng",
    "Quản lý KYC",
    "Xem giao dịch",
    "Từ chối giao dịch",
  ],
  "ROL-005": ["Xem bảng điều khiển"],
}

// Hàm giả lập gọi API lấy quyền của một role cụ thể.
// Khi nối API thật, chỉ cần thay phần đọc từ mock bằng request thực tế.
const getRolePermissions = async (
  roleId: string
): Promise<TRolePermissionsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    roleId,
    permissions: MOCK_ROLE_PERMISSIONS[roleId] ?? [],
  }
}

// Hook dùng ở UI để lấy quyền theo roleId.
// Mỗi role sẽ có cache riêng dạng: ["role-permissions", roleId]
// `enabled` giúp chỉ fetch khi thật sự cần, ví dụ khi mở sheet phân quyền.
export const useRolePermissions = (
  roleId: string,
  enabled = true
): UseQueryResult<TRolePermissionsResponse, Error> => {
  return useQuery({
    queryKey: [ROLE_PERMISSIONS_QUERY_KEY, roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}
