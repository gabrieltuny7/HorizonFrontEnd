$(document).ready(TaskListInitialize);

function TaskListInitialize() {
  $(".grid-column").sortable({
    connectWith: ".grid-column,.delete-container",
    receive: function(e, ui) {
      
    },
    stop: function (e, ui) {
      
    }
  });

}