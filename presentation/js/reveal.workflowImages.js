Reveal.WorkflowImages = {
    initialize: function() {
        var WORKFLOW_IMAGE_CLASS= '.workflow-image';
        $('body').keydown(animate);

        var currentEndPosition = null;

        function animate(keyPressEvent) {
            var direction = getDirection(keyPressEvent);

            if (direction == 0 || !hasWorkflowImage()) {
                return;
            }

            if (tryMove(direction)) {
                keyPressEvent.stopPropagation();
            }
        }

        function getDirection(event) {
            switch(event.which) {
                // p, page up
                case 80: case 33: case 75: case 38:
                return -1;
                // space, n, page down
                case 32: case 78: case 34: case 74: case 40:
                return +1;
                // default
                default:
                    return 0;
            }
        }

        function hasWorkflowImage() {
            return $(getCurrentSlide()).has(WORKFLOW_IMAGE_CLASS).length == 1;
        }

        function getCurrentSlide() {
            return $(Reveal.getCurrentSlide());
        }

        function getCurrentWorkflowImage() {
            return $(WORKFLOW_IMAGE_CLASS, Reveal.getCurrentSlide());
        }

        function tryMove(direction) {
            var $image=getCurrentWorkflowImage();

            var imageHeight = $image.attr('height');
            var stepHeight = $image.height() - 50;
            var maxHeight = imageHeight - $image.height();

            var currentBackgroundPosition = parseInt($image.css('background-position-y')) | 0;
            var currentPosition = (currentEndPosition == null) ? -currentBackgroundPosition : currentEndPosition;
            var endPosition =  Math.min(maxHeight, Math.max(0, currentPosition + direction * stepHeight));

            if (currentPosition === endPosition) {
                return false;
            }

            $image.animate({ 'background-position-y': -endPosition + 'px' }, 500);
            return true;
        }
    }
}