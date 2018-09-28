namespace paper.debug {
    const icons = {
        camera: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIcSURBVFhH7ZbPjtMwEMYj7vAACCFg28Rx4oQmtGnLQo/7Du1pK3Hk2BtSHwYkXoA34C34I7Fozxxoy+6yaocZx9M6u4WkFaA95JN+qu0Z21/riVOnVq1a/0oiaoMXPdlCBxpxG0xaNXlB+vHqIl7Utfo5Jl3LxU2uxpkmmjNp1RTEGfg4kZhOp/eRe8xwOHzqmnjSPXxnpjhBlIEIM5BRb40f96Ch2jCZTO6atGryVQeESjVmqCA/zGNy15/2xuv4xcuBK1N4KBNw445FZugauG/ndKr9GlJRYWBBxcn7LHveHAyOHtC4iJKLbQW0C0IlBRNemH6jTzpSQqouOFQ89iSdibLHcrKKbObYBqhGaC9qc/yaAdnKdMKjoLUe08QpvH7zFsp08fOyMI8N0DHRPqUGRJhXsWr112ME5SwWM73Jp5NTzecvFtg/+XqK0UsQ1vNvG+Ax6nN7bYBN8GPW0HVRZL44h+VqdW2cafcOYYUW9jZAAZb3uHiWxPcfZQae7Wdgmw7wYuEk5r8a8MPNBGa+OIMVGpBRfyu9rI/bL/+OAU/Sy2azOS06m81xgzItoRkmm3l7G2gGr7gwGR8LU+JbLAcvEQ29bIi8L4Li0bEBunR4TK9v2r81QCIDwiQSblwNzifYAMkNW+Dil6A2x/9ogGQvtg8HQn0wS2mxIY5LlV98pRqNRnfG4/HtXcD/CrfM9Fq1at1kOc4vVSG2+aaGzOwAAAAASUVORK5CYII=",
        light: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPcSURBVFhH3ZdLSNRRFMbn4fuZmtmYZpn0gCx6YbQokBZRq6hVL6xWUdCmICIoIYjaWBDRu3WShhUJLSKIIKISgqBWao9NlIsUwlKn33fnzDij/1HHsU0fHM693z333HPOffxnfNNBMBjcgRpCVjjiX6GwsHAJKhDpjYIAdqLCyEpHxKG8vLwgJyen2rrTR25uboPf7/+Ns31GxTBRAJmZmc2BQKC/rKys0qhpAz+Bt8inUCiUZ5xDsgAIeh5BDzCnzaj0kJ2d3YjDcFZW1imjHJIFkJGRcQf7waKiojqj0gdOH5DRz7y8vLlGeQZA6Vex+DBjLUalhtLS0iJrJoDsl+os4PiGUVqsHu48zVCEcYE+JdAfZF9qVAKS+XfgoM1nch+LnK2oqMg3OgYWvIhcsu44VFVV5RLAXYI9alQMBQUFsxm7prPk5dtBhwejdu03hr04Uonj4TftKy4ursVmP/bH0LvZmlgVQMwOBDlDh/D53bbmWklJSbGNeYMJW3D6kWaYBZ4Q/bLIiM+nM8BYG85G6Gr/ndD/owy5doWyE6joBmzf0Ayz8EsSXBsZmRqycHgCx/1MPieCyKtpdyNhgnTCluh2hHGuIFS519EgsGul/w27g3THPWRTAoemyg6OH2fPtLgWoz9OqI4CUNVu0Ve1QmxVidppgywaUUkXjwplVyWGsF9If+ZA5i3Knuw8F46KApCmEkfQKaEH+ewhWxG9xw+13zQnFJ0DBYl2DxHzDqO8/D5HRsGEVuTeWGFovcZx1D6VAKJVQl+gr8pt9/KLXNb4lIGjMzpgkwWhmyGN3V70zMHeguGJDqECtEP4k9M/Cy59cMe3ktUCtcnqKs7D+fn5bq+hEhYXrzZzjqN1DdcQcIPaKcOe2g6aKqfbr5qamhy4TnHKVA+QSh4V8ez/dbR7iml3Eugw+ibBzRE3KfRBYb+bmfhLwuLNY36IBFn4KGO6NfEVeI/tLhlEoS8ivq5gO8R4H4HoagYjox7AwXIMu5mgTDrIqtaGHOwTG31S/aoSduv0RBvnqhT/PRDYitX4fUFTt6NL35PIyBhoIkE8J8NtRiWAxR4x/tS642DV+4BcNCoefhJqYv5j2ql/F5i8GaV9PxlhXECbUM+QRY4AcLep4CC/pBcbNSMIUsIupFdZGuf5k4xTX0kAAwRy36j0QdkO6Fyg9xjl4BWAwOKnUSPcFFUoPegPBpl/RV7RTdi7ZAHoJxf2Xxh/TXd6vwOiIOt6HPWQzUajYkgWgMC8JsbfJT3xqaCuri7bmgmYKACgzDMizX+EuFswc39A/kfE/0RPAp/vL7M1A0/aWSCCAAAAAElFTkSuQmCC"
    };
    /**
     * @internal
     */
    export class EditorDefaultTexture extends SingletonComponent {

        public static CAMERA_ICON: egret3d.Texture;
        public static LIGHT_ICON: egret3d.Texture;

        public initialize() {
            {//TODO
                const texture = new egret3d.GLTexture2D("builtin/camera_icon.image.json");
                let image = new Image();
                image.setAttribute('src', icons["camera"]);
                image.onload = function () { texture.uploadImage(image, false, true, true, false); };
                EditorDefaultTexture.CAMERA_ICON = texture;
                paper.Asset.register(texture);
            }

            {//TODO
                const texture = new egret3d.GLTexture2D("builtin/light_icon.image.json");
                let image = new Image();
                image.setAttribute('src', icons["light"]);
                image.onload = function () { texture.uploadImage(image, false, true, true, false); };
                EditorDefaultTexture.LIGHT_ICON = texture;
                paper.Asset.register(texture);
            }
        }
    }
}