using System.Web;
using System.Web.Optimization;

namespace IE_MSC
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Datatable
            bundles.Add(new StyleBundle("~/bundles/datatablesCss").Include(
                  "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-bs5/css/dataTables.bootstrap5.min.css",
                  "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css",
                  "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css",
                  "~/Contents/template/HUD_Admin/assets/plugins/bootstrap-table/dist/bootstrap-table.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/datatablesJs").Include(
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net/js/jquery.dataTables.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-bs5/js/dataTables.bootstrap5.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-buttons/js/dataTables.buttons.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-buttons/js/buttons.colVis.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-buttons/js/buttons.flash.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-buttons/js/buttons.html5.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-buttons/js/buttons.print.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-buttons-bs5/js/buttons.bootstrap5.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-responsive/js/dataTables.responsive.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/datatables.net-responsive-bs5/js/responsive.bootstrap5.min.js",
                     "~/Contents/template/HUD_Admin/assets/plugins/bootstrap-table/dist/bootstrap-table.min.js"));

            BundleTable.EnableOptimizations = true;
        }
    }
}
