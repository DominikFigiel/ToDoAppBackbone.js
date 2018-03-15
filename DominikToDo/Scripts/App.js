$(function () {

    $(document).ready(function () {
        $("#taskModal").on('show.bs.modal', function () {

            var now = new Date();
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);

            var today = (now.getFullYear() + '-' + month + '-' + day);

            $('#newTaskDateInput').val(today);

            $('#newTaskContentInput').val("");

        });

        $("#taskModal").on('hidden.bs.modal', function () {

            $(".task-validation-error").addClass('hidden');

        });

        $("#taskEditModal").on('hidden.bs.modal', function () {

            $(".task-validation-error").addClass('hidden');

        });

    });
})